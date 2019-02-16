<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
let network = require("../../lib/network.js")

export default {
  data() {
    return {
      email: this.$route.query.email,
      txid: this.$route.query.txid,
      url: `${network.explorer}${this.txid}`,
      subject: `${process.title}です。学生の署名が完了しました。`,
      body: null,
      email_link: null
    }
  },
  mounted() {
    this.body = `txinfo: ${network.explorer}${this.txid}`

    this.email_link = `mailto:${this.email}?subject=${this.subject}&body=${this.body}`
  }
}
</script>
