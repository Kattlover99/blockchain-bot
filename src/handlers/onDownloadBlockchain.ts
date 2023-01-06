import {HearsMiddleware, InputFile} from "grammy";
import ContextModel from "../models/Context";
import {$db} from "../helpers/makeDb";

const onDownloadBlockchain: HearsMiddleware<ContextModel> = async(ctx) => {

  const lastBlockchainBlocks = await $db.blockchain.find().sort({_id: -1}).limit(50).sort({_id: 1}).toArray();

  return ctx.replyWithDocument(new InputFile(
    Buffer.from(JSON.stringify(lastBlockchainBlocks, null, 2)),
    "blockchain.json"
  ));
};

export default onDownloadBlockchain;
