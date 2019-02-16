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
      hash: null
    }
  },
  methods: {
  },
  watch: {
    cert(v) {
      // var createObjectURL = window.URL && window.URL.createObjectURL
      //   ? function(file) { return window.URL.createObjectURL(file); }
      //   : window.webkitURL && window.webkitURL.createObjectURL
      //   ? function(file) { return window.webkitURL.createObjectURL(file); }
      //   : undefined;
      let file = document.getElementById("cert").files[0]
      var fileReader = new FileReader();
      fileReader.onload = e => {
        let raw = e.target.result
        var rawBytes = new Uint8Array(raw);
        let hashedData = bitbox.Crypto.sha256(rawBytes).toString("hex")
        if(hashedData === this.hash) {
        } else {
          console.log(hashedData, this.hash)
        }
      }
      fileReader.readAsArrayBuffer(file);

    }
  },
  mounted() {
  }
}
</script>
