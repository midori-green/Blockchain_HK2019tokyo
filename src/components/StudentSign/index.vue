<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
import * as txn from '../../lib/transaction'

export default {
  data() {
    return {
      redeemScript: this.$route.query.redeemScript,
      certTxid: null,
      txid: this.$route.query.txid,
      email: this.$route.query.email,
    }
  },
  methods: {
    async sign() {
      this.$refs.submit.setAttribute("disabled", true)

      const account = this.$store.state.account
      const certSig = await txn.getCertSigByTxid(this.certTxid)
      const redeemScript = Buffer.from(this.redeemScript, 'hex')
      const txid = await txn.signWithCert(account, certSig, this.txid, redeemScript)
      this.$router.push({path: 'signed', query: { txid: txid, email: this.email }})

      this.$refs.submit.removeAttribute("disabled")
    }
  },
  mounted() {
    if(localStorage.getItem("dev") != null) {
      this.certTxid = "cb8525c35dcdfcb48e8c831d13d145c179f7bb2761d1dc39d209daa6dbc24e4e"
    }
  }
}
</script>
