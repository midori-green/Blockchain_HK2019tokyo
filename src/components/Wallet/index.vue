<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
import {Account} from '../../lib/account'

let account = null

export default {
  data() {
    return {
      balance: null,
      address: null,
      wif: null,
    }
  },

  methods: {
    resetWallet() {
      this.wif = null
      if(this.wif == null) {
        if(window.confirm("ウォレットを作り直すと、古いウォレットは完全に削除され、残高は永久に引き落とせなくなります。ウォレットを作り直してもよろしいですか？")) {
          if(window.confirm("本当に消してしまうのですか？　戻せませんよ？")) {
            if(window.confirm("後悔しませんね？")) {
              [...document.querySelectorAll('*')].map(e =>
                e.setAttribute("disabled", "disabled")
              )
              setTimeout(this.updateWallet, 500)
            }
          }
        }
      }
    },
    importWIF() {
      this.updateWallet(this.wif)
      this.wif = null
    },
    updateWallet(wif = null) {
      account = new Account(wif)

      this.address = account.address
      account.getBalance().then((ret) => {
        if(wif == null) {
          location.reload()
        }
        this.balance = ret
      })
      localStorage.setItem('wif', account.wif) // TODO: encrypt/decrypt wif
      this.$store.state.account = account
    },
    exportWIF() {
      let b = require("../../lib/blob.js")
      let blob = new b.BlobModule()
      let wif = localStorage.getItem('wif')
      let accountType = localStorage.getItem('accountType')
      blob.download(wif, `wif_${accountType}.txt`)
    }
  },

  mounted() {
    account = this.$store.state.account
    this.updateWallet(account.wif)
  }
}
</script>
