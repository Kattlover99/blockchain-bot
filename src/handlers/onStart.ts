import {CommandMiddleware} from "grammy";
import ContextModel from "../models/Context";
import mainMenu from "../menus/main";

const onStart: CommandMiddleware<ContextModel> = (ctx) => {

  ctx.session.state = null;
  ctx.session.data = null;

  return ctx.reply((`
    Hi ${ctx.$user.telegram.first_name}! 😉
    
    This is simple blockchain bot made by @congritta.
    
    Every user of this bot has blockchain account with fake currency. You can transfer your coins to every user by ` +
    "it's account address. You can't buy or sell your coins" + `
    
    This is a pet project. Source code is available here: github.com/congritta/blockchain-bot
    `
  ).replace(/^ +/gm, ""), {
    parse_mode: "HTML",
    reply_markup: mainMenu
  });
};

export default onStart;
