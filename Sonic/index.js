import { Twisters } from "twisters";
import { account } from "./account.js";
import { Config } from "./src/config/config.js";
import { Solana } from "./src/core/solana.js";
import { Helper } from "./src/utils/helper.js";
import logger from "./src/utils/logger.js";
import twist from "./src/utils/twist.js";
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = '7098779193:AAHY0W3sGA34Q9RUwxPdzwokWFzGMJRVz3s';
const TELEGRAM_CHAT_ID = '1167479139';

async function sendTelegramMessage(acc, solana) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const message = `Account: ${account.indexOf(acc) + 1}\nAddress: ${solana.address}\nBalance: ${solana.balance.toFixed(2)} SOL`;
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    });
  } catch (error) {
    console.error('Failed to send message:', error);
  }
}

async function operation(acc) {
  const solana = new Solana(acc);
  try {
    await solana.connectWallet();
    await solana.checkBalance();
    await solana.connect();
    await Helper.delay(1000);
    twist.log(`Getting Wallet Balance Information`, acc, solana);
    await solana.getRewardInfo();
    await solana.getDailyTx();
    await solana.checkIn();
    twist.log(`Starting Mass Tx`, acc, solana);
    if (100 - solana.dailyTx.total_transactions > 0) {
      while (solana.dailyTx.total_transactions <= 100) {
        await solana.sendSolToAddress(acc);
        const randWait = Helper.random(1000, 3000);
        await Helper.delay(randWait);
      }
    }
    await solana.getDailyTx();

    const claimableStage = [];
    if (solana.dailyTx.total_transactions >= 10) {
      claimableStage.push(1);
    }
    if (solana.dailyTx.total_transactions >= 50) {
      claimableStage.push(2);
    }
    if (solana.dailyTx.total_transactions >= 100) {
      claimableStage.push(3);
    }

    for (const stage of claimableStage) {
      await solana.claimTxMilestone(stage);
    }

    twist.log(`Opening ${solana.reward.ring_monitor} Mystery box`, acc, solana);
    logger.info(`Opening Mystery BOX`);
    const ringMonitor = new Array(solana.reward.ring_monitor);
    for (const box of ringMonitor) {
      await solana.claimMysteryBox();
    }

    if (Config.useLottery) {
      twist.log(`Drawing lottery for 10 Times`, acc, solana);
      const blockLottery = [];
      const drawLength = new Array(Config.drawAmount);
      for (const draw of drawLength) {
        const block = await solana.drawLottery();
        blockLottery.push(block);
      }
      logger.info(`Collected block ${blockLottery}`);

      twist.log(`Waiting And Claiming all lottery reward ${blockLottery}`, acc, solana);
      for (const block of blockLottery) {
        solana.lottery = 0;
        await solana.claimLottery(block).catch(() => {
          logger.info(`Error while claiming lottery, skipping claim`);
          twist.log(`Error while claiming lottery on block ${blockLottery}, skipping Claim`, acc, solana);
        });
      }
    }

    twist.log(`Account Processing Complete`, acc, solana);
    await sendTelegramMessage(acc, solana);
  } catch (error) {
    let msg = error.message;
    if (msg.includes("<!DOCTYPE html>")) {
      msg = msg.split("<!DOCTYPE html>")[0];
    }
    twist.log(`Error ${msg}, Retrying using Account ${account.indexOf(acc) + 1} after 10 Second...`, acc);
    logger.info(`Retrying using Account ${account.indexOf(acc) + 1}...`);
    logger.error(error);
    await Helper.delay(10000);
    await operation(acc);
  }
}

async function processBot() {
  logger.info(`RUN SONIC`);
  console.info(`RUN SONIC`);
  const allPromise = account.map(async (pk) => {
    await operation(pk);
  });

  await Promise.all(allPromise);

  logger.info();
  twist.clear();
  console.info(`SONIC FINISHED`);
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Exception:", reason);
  throw new Error("Unhandled Exception: " + reason);
});

(async () => {
  while (true) {
    logger.clear();
    console.log("Starting Sonic Bot...");
    await processBot();
    console.log("Sonic Bot operations completed. Waiting for 6 hours...");
    await new Promise(resolve => setTimeout(resolve, 21600000));  // 6 hours in milliseconds
  }
})();
