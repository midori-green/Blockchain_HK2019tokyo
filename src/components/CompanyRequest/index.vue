<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
import BITBOXSDK from 'bitbox-sdk/lib/bitbox-sdk'
import * as txn from '../../lib/transaction'
import * as script from '../../lib/script'
import {network} from '../../lib/network'

const bitbox = new BITBOXSDK()

export default {
  data() {
    return {
      cert: null,
      meta: null,
      hash: null,
      pubkey: null,
      studentMail: null,
      replyMail: null,
      studentAddress: null,
      hashedData: null,
    }
  },
  methods: {
    async sendTx() {
      const account = this.$store.state.account
      const studentHash160 = Buffer.from(bitbox.Address.toHash160(this.studentAddress), 'hex')
      const redeemScript = script.getVerifyRedeemScript(
        account.pubkey,
        3,
        this.pubkey,
        studentHash160,
        this.hashedData
      )
      const destAddress = script.getP2SHAddress(redeemScript, network)
      // const txid = await txn.simpleSend(account, destAddress, 1000)
      const txid = 'hoge'

      this.$router.push({
        path: 'requested',
        query: {
          txid: ret,
          redeemScript: redeemScript.toString('hex'),
          studentMail: studentMail,
          replyMail: replyMail,
        }
      })
    }
  },
  watch: {
    cert(v) {
      // var createObjectURL = window.URL && window.URL.createObjectURL
      //   ? function(file) { return window.URL.createObjectURL(file); }
      //   : window.webkitURL && window.webkitURL.createObjectURL
      //   ? function(file) { return window.webkitURL.createObjectURL(file); }
      //   : undefined;
      const file = document.getElementById("cert").files[0]
      const fileReader = new FileReader();
      fileReader.onload = e => {
        const raw = e.target.result
        const rawBytes = new Uint8Array(raw);
        const hashedData = bitbox.Crypto.sha256(rawBytes)
        const hashStr = hashedData.toString("hex")
        if(hashedData === this.hash) {
          this.hashedData = hashedData
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
