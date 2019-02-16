import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk';
import {network, bitboxCfg} from './network';

const bitbox = new BITBOXSDK(bitboxCfg);

export class Account {
  /**
   * @param {string} wif
   */
  constructor(wif = null) {
    if (wif == null || wif === '') {
      const mnemonic = bitbox.Mnemonic.generate();
      const seed = bitbox.Mnemonic.toSeed(mnemonic);
      const root = bitbox.HDNode.fromSeed(seed, network);
      const node = bitbox.HDNode.derivePath(root, `m/44'/145'/0'/0`);
      this.wif = bitbox.HDNode.toWIF(node);
    } else {
      this.wif = wif;
    }

    this.ecpair = bitbox.ECPair.fromWIF(this.wif);
    this.pubKey = bitbox.ECPair.toPublicKey(this.ecpair);
    this.address = bitbox.ECPair.toCashAddress(this.ecpair);
    this.hash160 = bitbox.Address.toHash160(this.address);
  }

  async getBalance() {
    const details = await bitbox.Address.details(this.address);

    return details.balance;
  }
}
