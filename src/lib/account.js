import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk';
import {network, bitboxCfg} from './network';
import { decodeIssueRedeemScript } from './script';

const bitbox = new BITBOXSDK(bitboxCfg);

function isSpentP2SH(tx) {
  if (tx.vout.length === 2
    && tx.vout[0].scriptPubKey === 'scripthash'
    && tx.vout[0].spentTxId != null
    && tx.vout[0].spentIndex === 0) {
      return true
  } else {
    return false
  }
}


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

  async getBalance(includeUnconfirmed = false) {
    const details = await bitbox.Address.details(this.address);

    return includeUnconfirmed ? details.balance + details.unconfirmedBalance : details.balance;
  }

  async getCertTxResults() {
    const reqTxs = (await bitbox.Address.transactions(this.address))
        .filter(el => isSpentP2SH(el))
    const p2shSpentTxId = reqTxs.map(el => el.vout[0].spentTxId)
  
    const result = []
    for (let i = 0; i < p2shSpentTxId.length; ++i) {
      const txid = p2shSpentTxId[i]
      const tx = await bitbox.Transaction.details(txid)
      const redeemScript = tx.vin[0].scriptSig.asm.split(' ')[-1]

      try {
        const scriptDetais = decodeIssueRedeemScript(redeemScript)
        result.push(scriptDetais)
      } catch(err) {
        continue
      }
    }

    return result
  }
}
