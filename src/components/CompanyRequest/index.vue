<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk'
import * as txn from '../../lib/transaction'
import * as script from '../../lib/script'
import { network } from '../../lib/network'

const bitbox = new BITBOXSDK()

export default {
  data() {
    return {
      cert: null,
      meta: null,
      hash: null,
      pubkey: this.$route.query.UnivPubKey,
      studentMail: this.$route.query.studentMail,
      replyMail: this.$route.query.studentMail,
      studentAddress: this.$route.query.studentAddress,
    }
  },
  methods: {
    sha256(v) {
      return bitbox.Crypto.sha256(v).toString("hex")
    },
    async verifyAndSend() {
      let merged = this.sha256(this.hashed_cert + this.hashed_meta)

      if(merged === this.hash) {
        const account = this.$store.state.account
        const studentHash160 = Buffer.from(bitbox.Address.toHash160(this.studentAddress), 'hex')
        const redeemScript = script.getVerifyRedeemScript(
          account.pubKey,
          3,
          Buffer.from(this.pubkey, 'hex'),
          studentHash160,
          Buffer.from(merged, 'hex')
        )
        const destAddress = script.getP2SHAddress(redeemScript, network)
        const txid = await txn.simpleSend(account, destAddress, 1000)
        // const txid = 'dummy-txid'

        this.$router.push({
          path: 'requested',
          query: {
            txid: txid,
            redeemScript: redeemScript.toString('hex'),
            studentEmail: this.studentMail,
            replyEmail: this.replyMail,
          }
        })
      } else {
        alert("Verification Failed")
      }
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
  created() {
    if(localStorage.getItem("dev") != null) {
      this.hash = "679f02ca9d9c789175af3a75dd6b88d5c05f734f0abfe3b61ed9178175f11152"
      this.pubkey = "02ec6cf9a8d7281fd89ecde4f5ccfc09290785e56f1080861ec33a86a8096ed646",
      this.studentMail = "m@jiyu.green"
      this.replyMail = "m@jiyu.green"
      this.studentAddress = "bitcoincash:qzqczdggrycp969lxtup0qmszltsfpv2hufexsxjg0"
    }
  },
  mounted() {
  }
}
</script>
