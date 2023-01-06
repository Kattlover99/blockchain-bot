import {HearsMiddleware} from "grammy";
import ContextModel from "../models/Context";
import mainMenu from "../menus/main";

const onMainMenu: HearsMiddleware<ContextModel> = (ctx) => {

  ctx.session.state = null;
  ctx.session.data = null;

  return ctx.reply(`
    Main Menu
  `.replace(/^ +/gm, ""), {
    reply_markup: mainMenu
  });
};

export default onMainMenu;
