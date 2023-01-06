import {CallbackQueryMiddleware} from "grammy";
import ContextModel from "../models/Context";

const onMyKeys: CallbackQueryMiddleware<ContextModel> = async(ctx) => {

  await ctx.reply(`
    🔑 <b>My Keys</b>
    
    These RSA keys are using for signing your transactions
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
  });

  await ctx.reply(`
    This is your private key. DON'T SHARE IT ANYWHERE

    <code>${ctx.$user.key.private}</code>
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
  });

  await ctx.reply(`
    <code>${ctx.$user.key.public}</code>
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
  });

  await ctx.reply(`
    This is your public key SHA256 hash. This is also your account address.

    <code>${ctx.$user.key.hash}</code>
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
  });

  await ctx.reply(`
    You can verify the keys by importing to any tool
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
  });

  return ctx.answerCallbackQuery();
};

export default onMyKeys;
