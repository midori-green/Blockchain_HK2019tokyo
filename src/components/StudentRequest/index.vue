<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
// const sha256 = bitbox.Crypto.sha256(msg)

export default {
  data() {
    return {
      cert: null,
      meta: null,
      hash: null
    }
  },
  methods: {
  },
  watch: {
    cert(v) {
      console.log(document.getElementById("cert").files[0])
    }
  },
  mounted() {
  }
}
</script>
