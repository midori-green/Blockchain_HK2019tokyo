<template src="./template.html"></template>
<style src="./style.css" scoped></style>

<script src="https://smtpjs.com/v3/smtp.js"></script>
<script>
Email.send({
    SecureToken : "C973D7AD-F097-4B95-91F4-40ABC5567812",
    To : 'm@jiyu.green',
    From : "you@isp.com",
    Subject : "This is the subject",
    Body : "And this is the body"
}).then(
  message => alert(message)
);

export default {
  mounted() {
  }
}
</script>
