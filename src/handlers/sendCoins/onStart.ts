import {HearsMiddleware, Keyboard} from "grammy";
import ContextModel from "../../models/Context";
import {$blockchain} from "../../helpers/Blockchain";

const onStart: HearsMiddleware<ContextModel> = async(ctx, next) => {

  if(ctx.session.state) {
    return next();
  }

  const balance = await $blockchain.getAccountBalance(ctx.$user.key.hash);
  if(balance <= 0) {
    return ctx.reply("❌ You have no coins to transfer");
  }

  ctx.session.state = "sendCoins.waitingForAccountAddress";

  return ctx.reply(`
    ℹ <b>You can send your coins to any user by their account address.</b>
    
    Enter receiver's account address
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
    reply_markup: new Keyboard().text("↪ Go back").resized()
  });
};

export default onStart;
