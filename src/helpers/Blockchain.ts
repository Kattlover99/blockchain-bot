import BlockchainNodeModel from "../models/BlockchainNode";
import {$db} from "./makeDb";
import {Double, ObjectId} from "mongodb";
import {$redis} from "./makeRedis";
import crypto from "crypto";

export default class Blockchain {

  isPending = true;

  constructor() {

    this.getBlocksAmount().then((amount) => {
      if(!amount) {
        this.generateGenesisBlock().then(() => {
          this.isPending = false;
        });
      }

      this.isPending = false;
    });
  }

  getBlocksAmount() {
    return $db.blockchain.countDocuments();
  }

  generateGenesisBlock() {
    const node: BlockchainNodeModel = {
      _id: new ObjectId(),
      createdAt: new Date(),
      transaction: {
        from: "",
        to: "",
        amount: new Double(0),
        signature: ""
      },
      previousBlockHash: ""
    };

    return $db.blockchain.insertOne(node);
  }

  async getAccountBalance(walletAddress: string) {

    if(!await $redis.get(`balance/${walletAddress}`)) {
      await $redis.set(`balance/${walletAddress}`, 0);

      // Calculate sum of incoming transactions
      for(const transaction of await $db.blockchain.aggregate([
        {
          $match: {
            "transaction.to": walletAddress,
          }
        },
        {
          $group: {
            _id: 1,
            incomingAmount: {$sum: "$transaction.amount"}
          }
        }
      ]).toArray()) {
        await $redis.incrby(`balance/${walletAddress}`, transaction.incomingAmount);
      }

      // Calculate sum of outgoing transactions
      for(const transaction of await $db.blockchain.aggregate([
        {
          $match: {
            "transaction.from": walletAddress,
          }
        },
        {
          $group: {
            _id: 1,
            outgoingAmount: {$sum: "$transaction.amount"}
          }
        }
      ]).toArray()) {
        await $redis.decrby(`balance/${walletAddress}`, transaction.outgoingAmount);
      }
    }

    return +((await $redis.get(`balance/${walletAddress}`)) as string);
  }

  async getLastBlock() {
    return (await $db.blockchain.find({}).sort({_id: -1}).limit(1).toArray())[0];
  }

  async makeTransaction(fromAddress: string, toAddress: string, amount: number) {

    const lastBlock = await this.getLastBlock();

    // Fetch sender and receiver from db
    const sender = await $db.users.findOne({"key.hash": fromAddress});
    const receiver = await $db.users.findOne({"key.hash": toAddress});
    if(!sender || !receiver) {
      throw new Error("Sender or receiver not found");
    }

    // Check sender has enough coins
    const senderBalance = await this.getAccountBalance(fromAddress);
    if(senderBalance - amount < 0) {
      throw new Error("Not enough coins");
    }

    // Create a transaction
    const block: BlockchainNodeModel = {
      _id: new ObjectId(),
      createdAt: new Date(),
      previousBlockHash: crypto.createHash("sha256").update(JSON.stringify(lastBlock)).digest("base64"),
      transaction: {
        from: fromAddress,
        to: toAddress,
        amount: new Double(amount),
        signature: crypto.sign("sha256", Buffer.from(JSON.stringify(lastBlock)), {
          key: sender.key.private,
        }).toString("base64")
      }
    };
    await $db.blockchain.insertOne(block);

    // Delete redis cache
    await $redis.del(`balance/${fromAddress}`);
    await $redis.del(`balance/${toAddress}`);
  }
}

export let $blockchain: Blockchain;

export function getBlockChain() {
  $blockchain = new Blockchain();

  return $blockchain;
}
