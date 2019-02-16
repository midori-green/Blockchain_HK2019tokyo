<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
export default {
  data() {
    return {
      txid: '',
      redeemScript: '',
    }
  },
  mounted() {
    this.txid = this.$route.query.txid
    this.redeemScript = this.$route.query.redeemScript
    const studentMail = this.$route.query.studentMail
    const replyMail = this.$route.query.replyMail

    const link = ''
    // TODO: send email
  }
}
</script>
