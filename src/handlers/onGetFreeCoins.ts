import {CallbackQueryMiddleware, InlineKeyboard} from "grammy";
import ContextModel from "../models/Context";
import BlockchainNodeModel from "../models/BlockchainNode";
import {Double, ObjectId} from "mongodb";
import {$blockchain} from "../helpers/Blockchain";
import crypto from "crypto";
import {$db} from "../helpers/makeDb";
import {$redis} from "../helpers/makeRedis";
import config from "../config";
import {printHumanAmount} from "../helpers/misc";

const onGetFreeCoins: CallbackQueryMiddleware<ContextModel> = async(ctx) => {

  if(ctx.from.id !== config.BOT_ADMIN_ID) {
    await ctx.answerCallbackQuery();
    return ctx.reply("Contact @congritta");
  }

  const lastBlockchainNode = await $blockchain.getLastBlock();

  const blockchainNode: BlockchainNodeModel = {
    _id: new ObjectId(),
    createdAt: new Date(),
    previousBlockHash: crypto.createHash("sha256").update(JSON.stringify(lastBlockchainNode)).digest("base64"),
    transaction: {
      from: "",
      to: ctx.$user.key.hash,
      amount: new Double(1000),
      signature: ""
    }
  };
  await $db.blockchain.insertOne(blockchainNode);

  await ctx.editMessageReplyMarkup({
    reply_markup: new InlineKeyboard().text("🔑 My Keys", "myKeys")
  });

  await $redis.del(`balance/${ctx.$user.key.hash}`);

  return ctx.answerCallbackQuery({
    text: `${printHumanAmount(1000)} coins credited to your account`,
    show_alert: true
  });
};

export default onGetFreeCoins;
