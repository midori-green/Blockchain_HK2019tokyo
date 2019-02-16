<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
import * as txn from '../../lib/transaction'

export default {
  data() {
    return {
      redeemScript: this.$route.query.redeemScript,
      certTxid: this.$route.query.certTxid,
      txid: this.$route.query.txid,
      email: this.$route.query.email,
    }
  },
  methods: {
    async sign() {
      const account = this.$store.state.account
      const certSig = await txn.getCertSigByTxid(this.certTxid)
      const redeemScript = Buffer.from(this.redeemScript, 'hex')
      const txid = await txn.signWithCert(account, certSig, this.txid, redeemScript)
      // const resultTxid = txid
      const resultTxid = `certsig: ${certSig.toString('hex')}` // dummy
      this.$router.push({path: 'signed', query: {txid: resultTxid}})
    }
  },
  mounted() {
    // TODO: set default value
  }
}
</script>
