import {HearsMiddleware, InlineKeyboard} from "grammy";
import ContextModel from "../models/Context";
import {$blockchain} from "../helpers/Blockchain";
import {printHumanAmount} from "../helpers/misc";
import config from "../config";

const onMyAccount: HearsMiddleware<ContextModel> = async(ctx) => {

  const balance = await $blockchain.getAccountBalance(ctx.$user.key.hash);

  const keyboard = new InlineKeyboard().text("🔑 My Keys", "myKeys");
  if((await $blockchain.getAccountBalance(ctx.$user.key.hash)) <= 0 || ctx.from?.id === config.BOT_ADMIN_ID) {
    keyboard.text("💰 Get Coins", "getFreeCoins");
  }

  return ctx.reply(`
    <b>Your account balance is:</b>
    $${printHumanAmount(balance)}
    
    <b>Your account address (for transfers):</b>
    <code>${ctx.$user.key.hash}</code>
    
    <b>Account created at:</b>
    <i>${ctx.$user.createdAt.toISOString()} (UTC)</i>
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
    reply_markup: keyboard
  });
};

export default onMyAccount;
