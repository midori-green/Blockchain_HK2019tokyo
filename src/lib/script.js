import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk'

const bitbox = new BITBOXSDK()

const { opcodes } = bitbox.Script

/**
 * @param {Buffer} recoveryPubKey
 * @param {number} recoveryNumBlocks
 * @param {Buffer} univPubKeyHash
 * @param {Buffer} digest
 * @param {Buffer} certOwnerPubKeyHash
 * @return {Buffer}
 */
export function getIssueRedeemScript(
  recoveryPubKey,
  recoveryNumBlocks,
  univPubKeyHash,
  digest,
  certOwnerPubKeyHash,
) {
  return bitbox.Script.encode([
    opcodes.OP_IF,
      recoveryPubKey,
      opcodes.OP_CHECKSIGVERIFY,
      Buffer.from([recoveryNumBlocks]),
      opcodes.OP_CHECKSEQUENCEVERIFY,
    opcodes.OP_ELSE,             // (certSig, univPubKey, txSig)
      opcodes.OP_OVER,           // (certSig, univPubKey, txSig, univPubKey)
      opcodes.OP_DUP,            // (certSig, univPubKey, txSig, univPubKey, univPubKey) <-[begin univ's p2pkh]
      opcodes.OP_HASH160,        // (certSig, univPubKey, txSig, univPubKey, hash160(univPubKey))
      univPubKeyHash,          // (certSig, univPubKey, txSig, univPubKey, hash160(univPubKey), univPubKeyHash)
      opcodes.OP_EQUALVERIFY,    // (certSig, univPubKey, txSig, univPubKey)
      opcodes.OP_CHECKSIGVERIFY, // (certSig, univPubKey)                                    <-[end univ's p2pkh]
      certOwnerPubKeyHash,       // (certSig, univPubKey, certOwnerPubKeyHash)
      digest,                    // (certSig, univPubKey, certOwnerPubKeyHash, digest)
      opcodes.OP_CAT,            // (certSig, univPubKey, certOwnerPubKeyHash|digest)
      opcodes.OP_SWAP,           // (certSig, certOwnerPubKeyHash|digest, univPubKey)
      opcodes.OP_CHECKDATASIG,   // (true)
    opcodes.OP_ENDIF,
  ])
}

export function decodeIssueRedeemScript(redeemScript) {
  const script = bitbox.Script.decode(redeemScript);

  const details = {
    recoveryPubKey: script[1],
    recoveryNumBlocks: script[3],
    univPubKeyHash: script[9],
    certOwnerPubKeyHash: script[12],
    digest: script[13],
  }

  if (!getIssueRedeemScript(
        details.recoveryPubKey,
        details.recoveryNumBlocks,
        details.univPubKeyHash,
        details.digest,
        details.certOwnerPubKeyHash
      ).equals(redeemScript)) {
      // throw Error('unexpected redeem script')
    }

  return details
}

/**
 * @param {Buffer} recoveryPubKey
 * @param {number} recoveryNumBlocks
 * @param {Buffer} univPubKey
 * @param {Buffer} studentPubKeyHash
 * @param {Buffer} digest
 * @return {Buffer}
 */
export function getVerifyRedeemScript(
  recoveryPubKey,
  recoveryNumBlocks,
  univPubKey,
  studentPubKeyHash,
  digest,
) {
  return bitbox.Script.encode([
    opcodes.OP_IF,
      recoveryPubKey,
      opcodes.OP_CHECKSIGVERIFY,
      Buffer.from([recoveryNumBlocks]),
      opcodes.OP_CHECKSEQUENCEVERIFY,
    opcodes.OP_ELSE,             // (certSig, studentPubKey, txSig)
      opcodes.OP_OVER,           // (certSig, studentPubKey, txSig, studentPubKey)
      opcodes.OP_DUP,            // (certSig, studentPubKey, txSig, studentPubKey, studentPubKey) <-[begin student's p2pkh]
      opcodes.OP_HASH160,        // (certSig, studentPubKey, txSig, studentPubKey, hash160(studentPubKey))
      studentPubKeyHash,         // (certSig, studentPubKey, txSig, studentPubKey, hash160(studentPubKey), studentPubKeyHash)
      opcodes.OP_EQUALVERIFY,    // (certSig, studentPubKey, txSig, studentPubKey)
      opcodes.OP_CHECKSIGVERIFY, // (certSig, studentPubKey)                                      <-[end student's p2pkh]
      opcodes.OP_HASH160,        // (certSig, hash160(studentPubKey))
      digest,                    // (certSig, hash160(studentPubKey), digest)
      opcodes.OP_CAT,            // (certSig, hash160(studentPubKey)|digest)
      univPubKey,              // (certSig, hash160(studentPubKey)|digest, univPubKey)
      opcodes.OP_CHECKDATASIG,   // (true)
    opcodes.OP_ENDIF,
  ])
}

export function getVerifyRedeemScriptv2(
  recoveryPubKey,
  recoveryNumBlocks,
  univPubKeyHash,
  studentPubKeyHash,
  digest,
) {
  return bitbox.Script.encode([
    opcodes.OP_IF,
      recoveryPubKey,
      opcodes.OP_CHECKSIGVERIFY,
      Buffer.from([recoveryNumBlocks]),
      opcodes.OP_CHECKSEQUENCEVERIFY,
    opcodes.OP_ELSE,             // (certSig, univPubKey, studentPubKey, txSig)
      opcodes.OP_OVER,           // (certSig, univPubKey, studentPubKey, txSig, studentPubKey)
      opcodes.OP_DUP,            // (certSig, univPubKey, studentPubKey, txSig, studentPubKey, studentPubKey) <-[begin student's p2pkh]
      opcodes.OP_HASH160,        // (certSig, univPubKey, studentPubKey, txSig, studentPubKey, hash160(studentPubKey))
      studentPubKeyHash,         // (certSig, univPubKey, studentPubKey, txSig, studentPubKey, hash160(studentPubKey), studentPubKeyHash)
      opcodes.OP_EQUALVERIFY,    // (certSig, univPubKey, studentPubKey, txSig, studentPubKey)
      opcodes.OP_CHECKSIGVERIFY, // (certSig, univPubKey, studentPubKey)                                      <-[end student's p2pkh]
      opcodes.OP_HASH160,        // (certSig, univPubKey, hash160(studentPubKey))
      digest,                    // (certSig, univPubKey, hash160(studentPubKey), digest)
      opcodes.OP_CAT,            // (certSig, univPubKey, hash160(studentPubKey)|digest)
      opcodes.OP_SWAP,           // (certSig, hash160(studentPubKey)|digest, univPubKey)
      opcodes.OP_DUP,            // (certSig, hash160(studentPubKey)|digest, univPubKey, univPubKey)
      opcodes.OP_HASH160,        // (certSig, hash160(studentPubKey)|digest, univPubKey, hash160(univPubKey))
      univPubKeyHash,            // (certSig, hash160(studentPubKey)|digest, univPubKey, hash160(univPubKey), univPubKeyHash)
      opcodes.OP_EQUALVERIFY,    // (certSig, hash160(studentPubKey)|digest, univPubKey)
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

export function getSpenderScriptSigv2(redeemScript, certSig, spenderPubKey, univPubKey, txSig) {
  return bitbox.Script.encode([
    certSig,
    univPubKey,
    spenderPubKey,
    txSig,
    opcodes.OP_FALSE,
    redeemScript,
  ])
}
