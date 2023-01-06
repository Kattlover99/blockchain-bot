import {CallbackQueryMiddleware, InlineKeyboard} from "grammy";
import ContextModel from "../models/Context";
import BlockchainNodeModel from "../models/BlockchainNode";
import {Double, ObjectId} from "mongodb";
import {$blockchain} from "../helpers/Blockchain";
import crypto from "crypto";
import {$db} from "../helpers/makeDb";
import {$redis} from "../helpers/makeRedis";

const onGetFreeCoins: CallbackQueryMiddleware<ContextModel> = async(ctx) => {

  const lastBlockchainNode = await $blockchain.getLastBlock();

  const blockchainNode: BlockchainNodeModel = {
    _id: new ObjectId(),
    createdAt: new Date(),
    previousBlockHash: crypto.createHash("sha256").update(JSON.stringify(lastBlockchainNode)).digest("base64"),
    transaction: {
      from: "",
      to: ctx.$user.key.hash,
      amount: new Double(10),
      signature: ""
    }
  };
  await $db.blockchain.insertOne(blockchainNode);

  await ctx.editMessageReplyMarkup({
    reply_markup: new InlineKeyboard().text("🔑 My Keys", "myKeys")
  });

  await $redis.del(`balance/${ctx.$user.key.hash}`);

  return ctx.answerCallbackQuery({
    text: "10 coins credited to your account",
    show_alert: true
  });
};

export default onGetFreeCoins;
