<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
import {Account} from '../../lib/account'

let account = null

export default {
  data() {
    return {
      balance: '',
      address: '',
      wif: '',
    }
  },

  methods: {
    resetWallet() {
      this.wif = ''
      this.updateWallet()
    },
    importFromWIF() {
      this.updateWallet(this.wif)
      this.wif = '' // clear text field
    },
    updateWallet(wif = null) {
      account = new Account(wif)

      this.address = account.address
      account.getBalance().then((ret) => {
        this.balance = ret
      })
      localStorage.setItem('wif', account.wif)
    }
  },

  mounted() {
    const wif = localStorage.getItem('wif')
    this.updateWallet(wif)
  }
}
</script>
