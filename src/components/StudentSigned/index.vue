<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
let network = require("../../lib/network.js")

export default {
  data() {
    return {
      txid: this.$route.query.txid,
      url: `${network.explorer}${this.txid}`
    }
  }
}
</script>
