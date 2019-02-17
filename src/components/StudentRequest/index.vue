<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk'
import * as txn from '../../lib/transaction'
import * as script from '../../lib/script'
import { network } from '../../lib/network';

const bitbox = new BITBOXSDK()

export default {
  data() {
    return {
      cert: null,
      meta: null,
      hash: this.$route.query.hash,
      hashed_cert: null,
      hashed_meta: null,
      address: this.$route.query.address, // univ bch address
      email: this.$route.query.email, // univ email
    }
  },
  methods: {
    sha256(v) {
      return bitbox.Crypto.sha256(v).toString("hex")
    },
    async verifyAndSend() {
      let loading = this.$loading.show()
      let merged = this.sha256(this.hashed_cert + this.hashed_meta)

      if(merged === this.hash) {
        const account = this.$store.state.account
        const redeemScript = script.getIssueRedeemScript(
          account.pubKey,
          3,
          Buffer.from(bitbox.Address.toHash160(this.address), 'hex'),
          Buffer.from(merged, 'hex'),
          Buffer.from(account.hash160, 'hex'),
        )
        const destAddress = script.getP2SHAddress(redeemScript, network)

        const txid = await txn.simpleSend(account, destAddress, 1000)

        this.$router.push({
          path: 'requested',
          query: {
            txid: txid,
            redeemScript: redeemScript.toString('hex'),
            email: this.email
          },
        })
      } else {
        this.$toasted.show("Verification Failed", {
          theme: "outline",
          position: "top-center",
          duration : 1500
        })
      }
      loading.hide()
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
