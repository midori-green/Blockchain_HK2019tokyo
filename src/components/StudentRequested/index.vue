<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
let network = require("../../lib/network.js")

export default {
  data() {
    return {
      email: this.$route.query.email,
      txid: this.$route.query.txid,
      redeemScript: this.$route.query.redeemScript,
      subject: `${process.title}です。学生からのトランザクションに署名してください。`,
      body: null,
      email_link: null
    }
  },
  mounted() {
    this.body = `redeemScript: ${this.redeemScript}, txinfo: ${network.explorer}${this.txid}
以上の情報を検証し、正しければ以下のリンクから署名をしてください。
http://localhost:8101/university/sign?redeemScript=${this.redeemScript}&txid=${this.txid}`

    this.email_link = `mailto:${this.email}?subject=${this.subject}&amp;body=${this.body}`
  }
}
</script>
