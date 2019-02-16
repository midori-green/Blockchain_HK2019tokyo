<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk'
const bitbox = new BITBOXSDK()

export default {
  data() {
    return {
      cert: null,
      meta: null,
      hash: this.$route.query.hash,
      hashed_cert: null,
      hashed_meta: null
    }
  },
  methods: {
    sha256(v) {
      return bitbox.Crypto.sha256(v).toString("hex")
    },
    verifyAndSend() {
      let merged = this.sha256(this.hashed_cert + this.hashed_meta)

      if(merged === this.hash) {
        this.$router.push("/")
      } else {
        alert("Verification Failed")
      }
    },
    saveHash(key, value) {
      this[key] = value
    }
  },
  watch: {
    cert(v) {
      this.$refs.submit.setAttribute("disabled", true)

      let file = document.getElementById("cert").files[0]
      var fileReader = new FileReader();
      fileReader.onload = e => {
        let raw = e.target.result
        var rawBytes = new Uint8Array(raw);
        this.hashed_cert = this.sha256(rawBytes).toString("hex")

        this.$refs.submit.removeAttribute("disabled")
      }
      fileReader.readAsArrayBuffer(file);
    },
    meta(v) {
      this.$refs.submit.setAttribute("disabled", true)

      let file = document.getElementById("meta").files[0]
      var fileReader = new FileReader();
      fileReader.onload = e => {
        let raw = e.target.result
        var rawBytes = new Uint8Array(raw);
        this.hashed_meta = this.sha256(rawBytes).toString("hex")

        this.$refs.submit.removeAttribute("disabled")
      }
      fileReader.readAsArrayBuffer(file);
    }
  },
  mounted() {
  }
}
</script>
