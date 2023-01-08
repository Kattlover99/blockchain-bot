import {Middleware} from "grammy";
import ContextModel from "../../models/Context";
import {$db} from "../../helpers/makeDb";
import {$blockchain} from "../../helpers/Blockchain";
import mainMenu from "../../menus/main";
import {printHumanAmount} from "../../helpers/misc";

const onStart: Middleware<ContextModel> = async(ctx, next) => {

  if(ctx.session.state !== "sendCoins.waitingForTransactionAmount") {
    return next();
  }

  // Receive transaction amount from message
  const amount = +(ctx.message?.text as string);
  if(isNaN(amount)) {
    return ctx.reply("❌ No valid transaction amount. Enter a number of coins to transfer");
  }
  if(amount === 0) {
    return ctx.reply("❌ You can't send 0 coins");
  }

  // Get sender's current balance
  const balance = await $blockchain.getAccountBalance(ctx.$user.key.hash);

  // Get receiver's account address
  const accountAddress = ctx.session.data.accountAddress;

  // Get receiver from db
  const receiver = await $db.users.findOne({"key.hash": accountAddress});
  if(!receiver) {
    throw new Error("Receiver not found");
  }

  // Fetch receiver's balance
  const receiverBalance = await $blockchain.getAccountBalance(accountAddress);

  // Check if enough coins
  if(balance - amount < 0) {
    return ctx.reply("❌ You have no enough coins");
  }

  // Perform transaction
  await $blockchain.makeTransaction(ctx.$user.key.hash, receiver.key.hash, amount);

  // Notify receiver
  await ctx.api.sendMessage(receiver.telegram.id, `
    ✅ <b>${ctx.$user.telegram.first_name} transferred you ${printHumanAmount(amount)} coins</b>

    Current balance: ${printHumanAmount(receiverBalance + amount)} coins
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML"
  });

  // Send ok message
  ctx.session.state = null;
  ctx.session.data = null;
  return ctx.reply(`
    ✅ <b>You've transferred ${printHumanAmount(amount)} coins.</b>
    
    Current balance: ${printHumanAmount(balance - amount)} coins
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
    reply_markup: mainMenu
  });
};

export default onStart;
