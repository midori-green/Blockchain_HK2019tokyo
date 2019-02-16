import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk'
import * as script from './script'
import {network, bitboxCfg} from './network'

const bitbox = new BITBOXSDK(bitboxCfg)

/**
 * @param {Account} account
 * @param {string} address
 */
export async function simpleSend(account, address, amount) {
  const txb = new bitbox.TransactionBuilder(network)
  let balance = 0

  const utxos = (await bitbox.Address.utxo(account.address)).utxos
    .filter(el => el.satoshis > 546)

  utxos.forEach((el) => {
    balance += el.satoshis
    txb.addInput(el.txid, el.vout)
  })

  // 224 satoshi
  const fee = bitbox.BitcoinCash.getByteCount({ P2PKH: utxos.length }, { P2PKH: 1, P2SH: 1 })

  const change = balance - amount - fee

  if (change < 546) {
    throw Error(`insuffisient balance: ${account.address} have ${balance} satoshi`)
  }

  txb.addOutput(address, amount)
  txb.addOutput(account.address, change)

  for (let i = 0; i < utxos.length; ++i) {
    txb.sign(i, account.ecpair, undefined, txb.hashTypes.SIGHASH_ALL, utxos[i].satoshis)
  }

  const hex = txb.build().toHex()
  const txid = (await bitbox.RawTransactions.sendRawTransaction(hex))[0]

  return txid
}

/**
 * @param {string} txid
 */
export async function getCertSigByTxid(txid) {
  const txDetails = (await bitbox.RawTransactions.getRawTransaction([txid], true))[0]

  // TODO: verify tx

  const targetTxin = txDetails.vin[0]

  const scriptSig = targetTxin.scriptSig.asm.split(' ')
  const certSig = scriptSig[0]

  return Buffer.from(certSig, 'hex')
}

/**
 * @param {string} txid
 */
export async function getSpenderScriptSig(txid) {
  const txDetails = (await bitbox.RawTransactions.getRawTransaction([txid], true))[0]

  // TODO: verify tx

  const targetTxin = txDetails.vin[0]

  const scriptSig = targetTxin.scriptSig.asm.split(' ')

  const certSig = Buffer.from(scriptSig[0], 'hex')
  const spenderPubKey = Buffer.from(scriptSig[1], 'hex')
  const txSig = Buffer.from(scriptSig[2], 'hex')

  return {certSig: certSig, spenderPubKey: spenderPubKey, txSig: txSig}
}

/**
 * @param {Buffer} digest
 * @param {string} hash160
 * @param {Account} account
 * @return {Buffer}
 */
export function getCertSigBySigning(digest, hash160, account) {
  const msg = Buffer.concat([
    Buffer.from(hash160, 'hex'),
    digest,
  ])
  const sha256 = bitbox.Crypto.sha256(msg)
  const certSig = bitbox.ECPair.sign(account.ecpair, sha256).toDER()

  return certSig
}

/**
 * @param {Account} account
 * @param {Buffer} certSig
 * @param {string} txid
 * @param {Buffer} redeemScript
 * @param {number} vout
 */
export async function signWithCert(account, certSig, prevTxid, redeemScript, vout = 0) {
  const txb = new bitbox.TransactionBuilder(network)
  const txDetails = (await bitbox.RawTransactions.getRawTransaction([prevTxid], true))[0]
  const output = txDetails.vout[vout]

  // TODO: verify tx and redeemScript

  txb.addInput(prevTxid, vout)

  const balance = bitbox.BitcoinCash.toSatoshi(output.value)
  const fee = balance - 546 // TBD
  const outAmount = balance - fee
  txb.addOutput(account.address, outAmount)

  const hashType = txb.hashTypes.SIGHASH_ALL | txb.hashTypes.SIGHASH_BITCOINCASH_BIP143

  const rawTx = txb.transaction.buildIncomplete()
  const sighash = rawTx.hashForCashSignature(0, redeemScript, balance, hashType)
  const txSig = bitbox.ECPair.sign(account.ecpair, sighash).toScriptSignature(hashType)

  const scriptSig = script.getSpenderScriptSig(redeemScript, certSig, account.pubKey, txSig)
  rawTx.setInputScript(0, scriptSig)

  const hex = rawTx.toHex()

  const txid = (await bitbox.RawTransactions.sendRawTransaction(hex))[0]

  return txid
}

export async function signWithCertv2(account, certSig, prevTxid, redeemScript, univPubKey, vout = 0) {
  const txb = new bitbox.TransactionBuilder(network)
  const txDetails = (await bitbox.RawTransactions.getRawTransaction([prevTxid], true))[0]
  const output = txDetails.vout[vout]

  // TODO: verify tx and redeemScript

  txb.addInput(prevTxid, vout)

  const balance = bitbox.BitcoinCash.toSatoshi(output.value)
  const fee = balance - 546 // TBD
  const outAmount = balance - fee
  txb.addOutput(account.address, outAmount)

  const hashType = txb.hashTypes.SIGHASH_ALL | txb.hashTypes.SIGHASH_BITCOINCASH_BIP143

  const rawTx = txb.transaction.buildIncomplete()
  const sighash = rawTx.hashForCashSignature(0, redeemScript, balance, hashType)
  const txSig = bitbox.ECPair.sign(account.ecpair, sighash).toScriptSignature(hashType)

  const scriptSig = script.getSpenderScriptSigv2(redeemScript, certSig, account.pubKey, univPubKey, txSig)
  rawTx.setInputScript(0, scriptSig)

  const hex = rawTx.toHex()

  const txid = (await bitbox.RawTransactions.sendRawTransaction(hex))[0]

  return txid
}

