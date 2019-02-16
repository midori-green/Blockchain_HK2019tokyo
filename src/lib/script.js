import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk'

const bitbox = new BITBOXSDK()

const { opcodes } = bitbox.Script

/**
 * @param {Buffer} recoveryPubKey
 * @param {number} recoveryNumBlocks
 * @param {Buffer} issuerPubKeyHash
 * @param {Buffer} digest
 * @param {Buffer} certOwnerPubKeyHash
 * @return {Buffer}
 */
export function getIssueRedeemScript(
  recoveryPubKey,
  recoveryNumBlocks,
  issuerPubKeyHash,
  digest,
  certOwnerPubKeyHash,
) {
  return bitbox.Script.encode([
    opcodes.OP_IF,
      recoveryPubKey,
      opcodes.OP_CHECKSIGVERIFY,
      Buffer.from([recoveryNumBlocks]),
      opcodes.OP_CHECKSEQUENCEVERIFY,
    opcodes.OP_ELSE,             // (certSig, issuerPubKey, txSig)
      opcodes.OP_OVER,           // (certSig, issuerPubKey, txSig, issuerPubKey)
      opcodes.OP_DUP,            // (certSig, issuerPubKey, txSig, issuerPubKey, issuerPubKey) <-[begin spender's p2pkh]
      opcodes.OP_HASH160,        // (certSig, issuerPubKey, txSig, issuerPubKey, hash160(issuerPubKey))
      issuerPubKeyHash,          // (certSig, issuerPubKey, txSig, issuerPubKey, hash160(issuerPubKey), issuerPubKeyHash)
      opcodes.OP_EQUALVERIFY,    // (certSig, issuerPubKey, txSig, issuerPubKey)
      opcodes.OP_CHECKSIGVERIFY, // (certSig, issuerPubKey)                                    <-[end spender's p2pkh]
      certOwnerPubKeyHash,       // (certSig, issuerPubKey, certOwnerPubKeyHash)
      digest,                    // (certSig, issuerPubKey, certOwnerPubKeyHash, digest)
      opcodes.OP_CAT,            // (certSig, issuerPubKey, certOwnerPubKeyHash|digest)
      opcodes.OP_SWAP,           // (certSig, certOwnerPubKeyHash|digest, issuerPubKey)
      opcodes.OP_CHECKDATASIG,   // (true)
    opcodes.OP_ENDIF,
  ])
}

/**
 * @param {Buffer} recoveryPubKey
 * @param {number} recoveryNumBlocks
 * @param {Buffer} issuerPubKey
 * @param {Buffer} spenderPubKeyHash
 * @param {Buffer} digest
 * @return {Buffer}
 */
export function getCertRedeemScript(
  recoveryPubKey,
  recoveryNumBlocks,
  issuerPubKey,
  spenderPubKeyHash,
  digest,
) {
  return bitbox.Script.encode([
    opcodes.OP_IF,
      recoveryPubKey,
      opcodes.OP_CHECKSIGVERIFY,
      Buffer.from([recoveryNumBlocks]),
      opcodes.OP_CHECKSEQUENCEVERIFY,
    opcodes.OP_ELSE,             // (certSig, spenderPubKey, txSig)
      opcodes.OP_OVER,           // (certSig, spenderPubKey, txSig, spenderPubKey)
      opcodes.OP_DUP,            // (certSig, spenderPubKey, txSig, spenderPubKey, spenderPubKey) <-[begin spender's p2pkh]
      opcodes.OP_HASH160,        // (certSig, spenderPubKey, txSig, spenderPubKey, hash160(spenderPubKey))
      spenderPubKeyHash,         // (certSig, spenderPubKey, txSig, spenderPubKey, hash160(spenderPubKey), spenderPubKeyHash)
      opcodes.OP_EQUALVERIFY,    // (certSig, spenderPubKey, txSig, spenderPubKey)
      opcodes.OP_CHECKSIGVERIFY, // (certSig, spenderPubKey)                                      <-[end spender's p2pkh]
      opcodes.OP_HASH160,        // (certSig, hash160(spenderPubKey))
      digest,                    // (certSig, hash160(spenderPubKey), digest)
      opcodes.OP_CAT,            // (certSig, hash160(spenderPubKey)|digest)
      issuerPubKey,              // (certSig, hash160(spenderPubKey)|digest, issuerPubKey)
      opcodes.OP_CHECKDATASIG,   // (true)
    opcodes.OP_ENDIF,
  ])
}

/**
 * @param {Buffer} redeemScript
 * @param {string} network
 * @return {string}
 */
export function getP2SHAddress(redeemScript, network) {
  const hash160 = bitbox.Crypto.hash160(redeemScript)
  const scriptPub = bitbox.Script.scriptHash.output.encode(hash160)
  const address = bitbox.Address.fromOutputScript(scriptPub, network)

  return address
}

/**
 * @param {Buffer} redeemScript
 * @param {Buffer} certSig
 * @param {Buffer} spenderPubKey
 * @param {Buffer} txSig
 * @return {Buffer}
 */
export function getSpenderScriptSig(redeemScript, certSig, spenderPubKey, txSig) {
  return bitbox.Script.encode([
    certSig,
    spenderPubKey,
    txSig,
    opcodes.OP_FALSE,
    redeemScript,
  ])
}
