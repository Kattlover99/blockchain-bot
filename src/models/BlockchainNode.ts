import {ObjectId} from "mongodb";
import TransactionModel from "./Transaction";

export default interface BlockchainNodeModel {
  _id: ObjectId,
  createdAt: Date,
  transaction: TransactionModel,
  previousBlockHash: string
}
