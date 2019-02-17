<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk'
import * as txn from '../../lib/transaction'
import * as script from '../../lib/script'

const bitbox = new BITBOXSDK()

export default {
  data() {
    return {
      cert: null,
      meta: null,
      hash: this.$route.query.hash,
      hashed_cert: null,
      hashed_meta: null,
      redeemScript: this.$route.query.redeemScript,
      txid: this.$route.query.txid,
      email: this.$route.query.email,
    }
  },
  methods: {
    sha256(v) {
      return bitbox.Crypto.sha256(v).toString("hex")
    },
    async sign() {
      let loading = this.$loading.show()

      const merged = this.sha256(this.hashed_cert + this.hashed_meta)

      if(merged === this.hash) {
        const account = this.$store.state.account
        const redeemScript = Buffer.from(this.redeemScript, 'hex')
        const decodedScript = script.decodeIssueRedeemScript(redeemScript)
        console.log("decodedScript", decodedScript)
        console.log("1","2","3", Buffer.from(merged, 'hex'),decodedScript.certOwnerPubKeyHash,
          account)
        const certSig = await txn.getCertSigBySigning(
          Buffer.from(merged, 'hex'),
          decodedScript.certOwnerPubKeyHash,
          account
        )
        const resultTxid = await txn.signWithCert(account, certSig, this.txid, redeemScript)
        // const resultTxid = `certsig: ${certSig.toString('hex')}` // dummy
        this.$router.push({
          path: 'signed',
          query: {
            txid: resultTxid,
            email: this.email,
          }
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
    },
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
    if(localStorage.getItem("test") != null) {
      this.hash = "679f02ca9d9c789175af3a75dd6b88d5c05f734f0abfe3b61ed9178175f11152"
      this.email = "m@jiyu.green"
    }
  }
}
</script>
