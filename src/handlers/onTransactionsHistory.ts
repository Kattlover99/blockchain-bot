import {HearsMiddleware} from "grammy";
import ContextModel from "../models/Context";
import {$db} from "../helpers/makeDb";
import {printHumanAmount} from "../helpers/misc";

const onTransactionsHistory: HearsMiddleware<ContextModel> = async(ctx, next) => {

  if(ctx.session.state) {
    return next();
  }

  const blocks = await $db.blockchain.find({
    $or: [
      {"transaction.to": ctx.$user.key.hash},
      {"transaction.from": ctx.$user.key.hash},
    ]
  }).sort({_id: -1}).limit(10).sort({_id: 1}).toArray();

  let transactionsHistory = "";

  for(const block of blocks) {
    const isTransactionIncoming = block.transaction.to === ctx.$user.key.hash;

    transactionsHistory += `
      <b>${isTransactionIncoming ? "⬇ Received" : "⬆ Sent"} ${printHumanAmount(+block.transaction.amount)} coins</b>
      <i>${block.createdAt.toISOString()}</i> (UTC)
      <code>${isTransactionIncoming ? block.transaction.from : block.transaction.to}</code>
    `;
  }
  if(!blocks.length) {
    transactionsHistory += "No transactions yet";
  }

  return ctx.reply(`
    📜 <b>Transactions History</b>
    
    There are last 10 transactions about you:
    ${transactionsHistory}
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML",
  });
};

export default onTransactionsHistory;
