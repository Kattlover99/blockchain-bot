import {Collection, MongoClient} from "mongodb";
import config from "../config";
import UserModel from "../models/User";
import BlockchainNodeModel from "../models/BlockchainNode";

export let $db: {
  users: Collection<UserModel>,
  blockchain: Collection<BlockchainNodeModel>
};

export async function makeDb(): Promise<typeof $db> {

  const client = new MongoClient(config.DB.URL);
  await client.connect();

  const db = client.db(config.DB.NAME);

  $db = {
    users: db.collection("users"),
    blockchain: db.collection("blockchain")
  };

  return $db;
}
