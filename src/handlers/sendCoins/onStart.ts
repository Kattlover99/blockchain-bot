import {HearsMiddleware, Keyboard} from "grammy";
import ContextModel from "../../models/Context";

const onStart: HearsMiddleware<ContextModel> = (ctx, next) => {

  if(ctx.session.state) {
    return next();
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
