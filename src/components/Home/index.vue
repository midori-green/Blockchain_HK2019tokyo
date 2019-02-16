<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script>
export default {
  created() {
    if(!localStorage.getItem("accountType")) {
      this.$router.push("/register")
    } else {
      this.$router.push("/wallet")
    }
  }
}
</script>
