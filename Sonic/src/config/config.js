import { addressList } from "./address_list.js";

export class Config {
  static sendAmount = 0.0001;
  static destAddress = addressList;
  static drawAmount = 5;
  static maxRetry = 3;
  static useLottery = false;
}
