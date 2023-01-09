import {Keyboard, Middleware} from "grammy";
import ContextModel from "../../models/Context";
import {$db} from "../../helpers/makeDb";
import {$blockchain} from "../../helpers/Blockchain";
import {printHumanAmount} from "../../helpers/misc";

const onStart: Middleware<ContextModel> = async(ctx, next) => {

  if(ctx.session.state !== "sendCoins.waitingForAccountAddress") {
    return next();
  }

  // Get user's current balance
  const balance = await $blockchain.getAccountBalance(ctx.$user.key.hash);

  // Receive account address from message
  const accountAddress = ctx.message?.text as string;
  ctx.session.data = {
    accountAddress
  };

  // Search an account by address
  const receiver = await $db.users.findOne({
    _id: {$ne: ctx.$user._id},
    "key.hash": accountAddress
  });
  if(!receiver) {
    return ctx.reply("❌ No such account found");
  }

  // Prompt for transaction amount
  ctx.session.state = "sendCoins.waitingForTransactionAmount";
  return ctx.reply(`
    Ok. Now enter amount of your transaction. You currently have <b>${printHumanAmount(balance)}</b> coins
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
    reply_markup: new Keyboard().text("↪ Main menu").resized()
  });
};

export default onStart;
