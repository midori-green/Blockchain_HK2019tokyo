<template>
  <div id="app">
    <header>
      <div>
        <router-link id="logo" class="btn" to="/">Verify.green</router-link>
        <template v-if="dev">
          <a class="btn" v-on:click="switchUser('student')"><img :src="student"></a>
          <a class="btn" v-on:click="switchUser('university')"><img :src="university"></a>
          <a class="btn" v-on:click="switchUser('company')"><img :src="company"></a>
        </template>
      </div>
    </header>
    <router-view id="main" />

    <footer id="footer">
      <b-col>
        <div class="contact">
          <a href="mailto:m@jiyu.green" target="_blank">contact</a>
        </div>

        <div class="license">
          このアプリは<a href="https://www.eventbrite.com/e/2019-tickets-55006025503" target="_blank">ブロックチェーンハッカソン2019</a>提出作品です。<br>
          Licensed under <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a>
        </div>
      </b-col>
    </footer>
  </div>
</template>

<script>
import {Account} from './lib/account'

export default {
  data() {
    return {
      cc_url: `http://creativecommons.org/licenses/by-nc/4.0/deed.ja`,
      student: require("./images/student.svg"),
      university: require("./images/university.svg"),
      company: require("./images/company.svg"),
      dev: false
    }
  },
  watch: {
    "$route"(v) {
      this.updateWallet()
    }
  },
  methods: {
    updateWallet() {
      let v = this.$route
      if(this.isDev()) {
        let wif = null
        if(v.path.includes("university")) {
          localStorage.setItem("accountType", "university")
          wif = "L378rkMAtZVXcsztHH4czvcr1ir9AXwqc166EXLdHiL2AAGQCeia"
        } else if(v.path.includes("company")) {
          localStorage.setItem("accountType", "company")
          wif = "L2Xh3PKNCDK1CXHvtuMKCXv4pPbh6sjsWTehdRP77ERwnMkf1VWx"
        } else {
          localStorage.setItem("accountType", "student")
          wif = "L3Mq8X2tq95WYySdwo8HZtoEmVDnKGfdb6pTozq1nd8qrMaBhXvb"
        }

        let account = new Account(wif)
        this.address = account.address
        localStorage.setItem('wif', account.wif) // TODO: encrypt/decrypt wif
        this.$store.state.account = account
      }
    },
    switchUser(user) {
      if(["student", "university", "company"].indexOf(user) != -1) {
        localStorage.setItem("accountType", user)
        this.updateWallet()
      }
    },
    isDev() {
      this.dev = localStorage.getItem('dev') !== null || this.$route.query.dev != null
    }
  },
  created() {
    setTimeout(() => {
      if(this.isDev()) {
        localStorage.setItem('dev', "1")
      }
      if(this.$route.query.prod != null) {
        localStorage.removeItem('dev')
      }
      this.switchUser(localStorage.getItem("accountType"))
    }, 500)
  },
  mounted() {
    if(localStorage.getItem("accountType") == null) {
      this.switchUser("student")
    }
    if (this.$store.state.account == null) {
      const wif = localStorage.getItem('wif') // TODO: encrypt/decrypt wif
      this.$store.state.account = new Account(wif)
    }
  }
}
</script>

<style>
/* Common */
html, #app, img, header {
  background-color: #e1fae1 !important;
  font-size: 18px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  font-size: 3rem;
  background-color: #e6ffe6;
}

#locale {
  font-size: 14px;
}

.container {
  max-width: 800px !important;
}

/* Heading */

h1 {
  font-size: 3rem;
}
h2 {
  font-size: 2rem;
}
h3 {
  font-size: 1.75rem;
}
h4 {
  font-size: 1.5rem;
}
h5 {
  font-size: 1.25rem;
}
h6 {
  font-size: 1rem;
}

/* Button */

.btn-success {
  background-image: -webkit-linear-gradient(top,#5cb85c 0,#419641 100%);
  background-image: -o-linear-gradient(top,#5cb85c 0,#419641 100%);
  background-image: -webkit-gradient(linear,left top,left bottom,from(#5cb85c),to(#419641));
  background-image: linear-gradient(to bottom,#5cb85c 0,#419641 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff5cb85c', endColorstr='#ff419641', GradientType=0);
  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
  background-repeat: repeat-x;
  border-color: #3e8f3e;
}

.btn-success:hover {
  color: white !important;
}

.btn-default {
  text-shadow: 0 1px 0 #fff;
  background-image: -webkit-linear-gradient(top,#fff 0,#e0e0e0 100%);
  background-image: -o-linear-gradient(top,#fff 0,#e0e0e0 100%);
  background-image: -webkit-gradient(linear,left top,left bottom,from(#fff),to(#e0e0e0));
  background-image: linear-gradient(to bottom,#fff 0,#e0e0e0 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffe0e0e0', GradientType=0);
  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
  background-repeat: repeat-x;
  border-color: #000;
}

/* Anker */

a:link {
  color: green;
}
a:visited {
  color: darkgreen;
}
a:hover {
  color: green !important;
}
a:active {
  color: green;
}

/* Header */

header {
  width: 100%;
  position: fixed;
  top: 0;
  border-bottom: 1px solid darkgreen;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  height: 45px;
}

header img {
  height: 35px;
}

header > div {
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

header a {
  color:green;
  font-weight: normal !important;
}

header a:hover {
  color: green;
}

header a:active {
  color: green;
}

header a:visited {
  color: darkgreen;
}

header .btn {
  margin-left: 2%;
}

/* Main */
#main .btn-success {
  color: white;
}

#main .input_fields {
  margin-top: 20px;
}

/* footer */

footer {
  border-top: 1px solid darkgreen;
  margin-top: 50px;
}

footer + #btn-notify {
  display: none !important;
}

.twitter, .facebook {
  width: 10%;
  max-width: 50px;
  margin-left: 10px;
}

#twitter-widget-1 {
  margin-right: 10px;
}

.facebook {
  margin-top: 10px;
  margin-bottom: 10px;
}

.fb-like {
  margin-right: 10px;
}

.license {
  margin-top: 10px;
}

/* Ads */

.gc_ad_main {
  display: none;
}

/* Vue Toast */
.toasted.bubble {
  background-color: limegreen !important;
  border-color: limegreen !important;
}

.toasted.outline {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: white !important;
}

</style>
