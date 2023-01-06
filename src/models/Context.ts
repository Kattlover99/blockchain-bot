import UserModel from "./User";
import {Context, SessionFlavor} from "grammy";

export interface SessionStorageModel {
  state: null
    | "sendCoins.waitingForAccountAddress"
    | "sendCoins.waitingForTransactionAmount";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

type ContextWithSession = Context & SessionFlavor<SessionStorageModel>

export default interface ContextModel extends ContextWithSession {
  $user: UserModel;
}
