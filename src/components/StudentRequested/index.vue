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
    let hash = ""
    let email = ""
    if(localStorage.getItem("dev") != null) {
      hash = "&hash=679f02ca9d9c789175af3a75dd6b88d5c05f734f0abfe3b61ed9178175f11152"
      email = "&email=m@jiyu.green"
    }

    let link_url = `http://${location.host}/university/sign?txid=${this.txid}${hash}${email}&redeemScript=${this.redeemScript}`
    link_url = encodeURIComponent(link_url)

    this.body = `redeemScript: ${this.redeemScript}, txinfo: ${network.explorer}${this.txid}

以上の情報を検証し、正しければ以下のリンクから署名をしてください。　

${link_url}
`

    this.email_link = `mailto:${this.email}?subject=${this.subject}&body=${this.body}`
  }
}
</script>
