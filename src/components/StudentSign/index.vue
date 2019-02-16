<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
import * as txn from '../../lib/transaction'

export default {
  data() {
    return {
      redeemScript: '',
      certTxid: '',
      txid: '',
      mail: '',
      resultTxid: '',
    }
  },
  methods: {
    async sign() {
      const account = this.$store.state.account
      const certSig = await txn.getCertSigByTxid(this.certTxid)
      const redeemScript = Buffer.from(this.redeemScript, 'hex')
      // const txid = await txn.signWithCert(account, certSig, this.txid, redeemScript)
      // this.resultTxid = txid
      this.resultTxid = `certsig: ${certSig.toString('hex')}` // dummy
    }
  },
  mounted() {
    // TODO: set default value
  }
}
</script>
