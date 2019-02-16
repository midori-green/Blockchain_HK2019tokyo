import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk'

const bitbox = new BITBOXSDK()

export class Account {
  /**
   * @param {string} wif
   */
  constructor(wif) {
    this.wif = wif;
    this.ecpair = bitbox.ECPair.fromWIF(this.wif);
    this.pubKey = bitbox.ECPair.toPublicKey(this.ecpair);
    this.address = bitbox.ECPair.toCashAddress(this.ecpair);
    this.hash160 = bitbox.Address.toHash160(this.address);
  }
}
