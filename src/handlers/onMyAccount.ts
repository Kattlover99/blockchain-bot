import {HearsMiddleware, InlineKeyboard} from "grammy";
import ContextModel from "../models/Context";
import {$blockchain} from "../helpers/Blockchain";

const onMyAccount: HearsMiddleware<ContextModel> = async(ctx) => {

  const balance = await $blockchain.getAccountBalance(ctx.$user.key.hash);

  const keyboard = new InlineKeyboard().text("🔑 My Keys", "myKeys");
  if((await $blockchain.getAccountBalance(ctx.$user.key.hash)) <= 0) {
    keyboard.text("💰 Get free 10 coins", "getFreeCoins");
  }

  return ctx.reply(`
    <b>Your account balance is:</b>
    $${balance.toFixed(2)}
    
    <b>Your account address (for transfers):</b>
    <code>${ctx.$user.key.hash}</code>
    
    <b>Account created at:</b>
    <i>${ctx.$user.createdAt.toLocaleString("en")} (UTC)</i>
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
    reply_markup: keyboard
  });
};

export default onMyAccount;
