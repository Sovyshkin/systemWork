<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      isLoading: false,
      id: localStorage.getItem("id"),
    };
  },
  methods: {},
  mounted() {},
};
</script>

<template>
  <header>
    <img
      @click="$router.go(-1)"
      class="back"
      :class="{ show: $route.path == '/' || $route.path == '/login' }"
      src="./assets/back.png"
      alt=""
    />
    <img
      v-if="id"
      @click="$router.push({ name: 'profile' })"
      class="profile"
      src="./assets/profile.png"
      alt=""
    />
  </header>
  <router-view class="wrapView"></router-view>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap");
* {
  padding: 0px;
  margin: 0px;
  border: none;
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  font-style: normal;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Links */

a,
a:link,
a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

/* Common */

aside,
nav,
footer,
header,
section,
main {
  display: block;
}

ul,
ul li {
  list-style: none;
}

img {
  vertical-align: top;
}

img,
svg {
  max-width: 100%;
  height: auto;
}

address {
  font-style: normal;
}

/* Form */

input,
textarea,
button,
select {
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background-color: transparent;
}

input::-ms-clear {
  display: none;
}

button,
input[type="submit"] {
  display: inline-block;
  box-shadow: none;
  background-color: transparent;
  background: none;
  cursor: pointer;
}

input:focus,
input:active,
button:focus,
button:active {
  outline: none;
}

button::-moz-focus-inner {
  padding: 0;
  border: 0;
}

.wrap {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.bx {
  transition: 500ms ease;
}

.bx:hover {
  box-shadow: 0 0 10px 7px #53515137;
  transform: translateY(-3px);
}

.msg {
  padding: 10px 13px;
  font-size: 16px;
  line-height: 16px;
  color: #fff;
  border-radius: 15px;
  width: fit-content;
  margin: 0 auto;
}

.success {
  background-color: #45ed0b;
}

.error {
  background-color: #cf0032;
}

.profile {
  height: 50px;
  width: 50px;
  cursor: pointer;
}

header {
  padding: 20px;
  width: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back {
  height: 30px;
  width: 30px;
  cursor: pointer;
}
.not_found {
  min-height: 10vh;
}

.wrapper-modal {
  position: absolute;
  height: 100vh;
  width: 100%;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
}

.modal {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 32px;
  border-radius: 20px;
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 0 7px 7px #53515137;
}

.wrap-close {
  position: absolute;
  top: 3%;
  right: 2%;
  display: flex;
  justify-content: end;
  align-items: center;
}

.close {
  cursor: pointer;
  height: 24px;
  width: 24px;
}

.wrap-btns-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

h1 {
  text-align: center;
}

.wrapper {
  padding-top: 0px !important;
}

.show {
  opacity: 0;
}

@media (max-width: 540px) {
  .wrapper {
    padding: 0px 20px 10px 20px !important;
  }

  header {
    padding: 10px;
  }
}
</style>
