import UserModel from "./User";
import {Double} from "mongodb";

export default interface TransactionModel {
  from: UserModel["key"]["hash"],
  to: UserModel["key"]["hash"],
  amount: Double,
  signature: string
}
