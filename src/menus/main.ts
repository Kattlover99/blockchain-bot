import {Keyboard} from "grammy";

const mainMenu = new Keyboard()
  .text("💰 My Account").text("💸 Send Coins").row()
  .text("📜 Transactions History").row()
  .text("🔗 Download Blockchain").row()
  .webApp("ℹ About the Bot", "https://git.congritta.com/blockchain-bot").row()
  .resized(true);

export default mainMenu;
