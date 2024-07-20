import { Twisters } from "twisters";
import { account } from "../../account.js";
import { Solana } from "../core/solana.js";

class Twist {
  constructor() {
    /** @type  {Twisters} */
    this.twisters = new Twisters();
  }

  /**
   * Enhanced logging for better readability and visual appeal.
   * @param {string} acc Account identifier.
   * @param {Solana} solana Instance of Solana for accessing account details.
   * @param {string} msg Status message to display.
   */
  log(msg = "", acc = "", solana = new Solana(acc)) {
    const address = solana.address ?? "-";
    const balance = solana.balance?.toFixed(2) ?? "-";
    const total_transactions = solana.dailyTx?.total_transactions ?? "-";
    const shortMsg = msg.length > 50 ? msg.substring(0, 47) + '...' : msg;  // Truncate long messages.

    const accountIndex = account.indexOf(acc) + 1;
    const accountString = `Acc ${accountIndex.toString().padStart(3, '0')}`;
    const balanceString = `${balance} SOL`.padEnd(12, ' ');
    const txString = `TX: ${total_transactions}`.padEnd(15, ' ');

    this.twisters.put(acc, {
      text: `${accountString}: ${address} | ${balanceString} | ${txString} | ${shortMsg}`
    });
  }

  clear() {
    this.twisters.flush();
  }
}

export default new Twist();
