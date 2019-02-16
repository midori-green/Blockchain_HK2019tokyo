<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
export default {
  data() {
    return {
      txid: ''
    }
  },
  asyncData(context) {
    return {
      txid: context.query['txid']
    }
  },

  mounted() {
    // console.log(this.$route.params)
    this.txid = this.$route.query.txid
  }
}
</script>
