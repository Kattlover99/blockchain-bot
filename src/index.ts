import {Bot, session} from "grammy";
import config from "./config";
import consola from "consola";
import {makeDb} from "./helpers/makeDb";
import ContextModel, {SessionStorageModel} from "./models/Context";
import {asyncSleep} from "./helpers/misc";
import {getBlockChain} from "./helpers/Blockchain";
import $redis from "./helpers/makeRedis";
import {RedisAdapter} from "@grammyjs/storage-redis";

// Wrap all console out to consola
consola.wrapAll();

// Create new bot instance
export const bot = new Bot<ContextModel>(config.BOT_TOKEN);

// Set up sessions
bot.use(session({
  initial: (): SessionStorageModel => ({
    state: null,
    data: null
  }),
  storage: new RedisAdapter({instance: $redis})
}));

// Set up middlewares
import("./middlewares/saveUsersToDb").then(({default: handler}) => bot.use(handler));

// Main handlers
import("./handlers/onStart").then(({default: handler}) => bot.command("start", handler));
import("./handlers/onMainMenu").then(({default: handler}) => bot.hears(/go back|main menu/i, handler));
import("./handlers/onMyAccount").then(({default: handler}) => bot.hears(/my account/i, handler));
import("./handlers/onTransactionsHistory").then(({default: handler}) => bot.hears(/history/i, handler));
import("./handlers/onDownloadBlockchain").then(({default: handler}) => bot.hears(/download blockchain/i, handler));
import("./handlers/onMyKeys").then(({default: handler}) => bot.callbackQuery("myKeys", handler));
import("./handlers/onGetFreeCoins").then(({default: handler}) => bot.callbackQuery("getFreeCoins", handler));

// Send coins handlers
import("./handlers/sendCoins/onStart").then(({default: handler}) => bot.hears(/send coins/i, handler));
import("./handlers/sendCoins/onAccountAddress").then(({default: handler}) => bot.on("msg", handler));
import("./handlers/sendCoins/onAmount").then(({default: handler}) => bot.on("msg", handler));

// Handle bot errors
bot.catch((error) => {
  const $error = error.error;

  consola.error($error);

  error.ctx.reply(`
    ❌ <b>An error occured during processing your message</b>:

    <code>${error.message}</code>

    Send this message to bot maintainers to solve this problem
  `.replace(/^ +/gm, ""), {
    parse_mode: "HTML"
  });
});

// Init a bot
Promise.resolve()
  .then(() => makeDb())
  .then(() => (async() => {
    consola.info("Initializing blockchain...");
    const blockchain = getBlockChain();
    while(blockchain.isPending) {
      await asyncSleep(300);
      consola.info("Waiting for pending blockchain");
    }
    consola.success("Blockchain initialized!");
  })())
  .then(() => bot.start({
    drop_pending_updates: true,
    onStart() {
      consola.ready("Bot launched");
    }
  }));
