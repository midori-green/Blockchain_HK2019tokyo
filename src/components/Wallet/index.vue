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
      wif_file: null,
      wif: null,
    }
  },

  methods: {
    getAccountType() {
      return localStorage.getItem("accountType")
    },
    resetWallet() {
      this.wif = null
      if(this.wif == null) {
        if(window.confirm("ウォレットを作り直すと、古いウォレットは完全に削除され、残高は永久に引き落とせなくなります。ウォレットを作り直してもよろしいですか？")) {
          if(window.confirm("本当に消してしまうのですか？　戻せませんよ？")) {
            if(window.confirm("後悔しませんね？")) {
              [...document.querySelectorAll('button,input')].map(e =>
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
      let includeUnconfirmed = false
      if(localStorage.getItem("test") != null) {
        includeUnconfirmed = true
      }
      account.getBalance(includeUnconfirmed).then((ret) => {
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
      blob.download(localStorage.getItem('wif'), `wif.txt`)
    }
  },
  watch: {
    wif_file(v) {
      let allAttributes = [...document.querySelectorAll('button,input')]
      allAttributes.map(e => {
        e.setAttribute("disabled", "disabled")
      })
      let file = document.getElementById("wif_file").files[0]
      var fileReader = new FileReader();
      fileReader.onload = e => {
        this.wif = e.target.result.trim()
        this.importWIF()

        this.$toasted.show("Succeed to update!", {
          theme: "bubble",
          position: "top-center",
          duration : 1500
        })

        allAttributes.map(e => {
          e.removeAttribute("disabled")
        })
      }
      fileReader.readAsText(file);
    }
  },
  mounted() {
    account = this.$store.state.account
    this.updateWallet(account.wif)
  }
}
</script>
