<script>
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<template>
  <AppHeader />
  <router-view></router-view>
  <AppFooter
    v-if="
      this.$route.name != 'admin' &&
      this.$route.name != 'login' &&
      this.$route.name != 'create'
    "
  />
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

h1,
h2,
h3,
h4,
h5,
h6,
p {
  font-size: inherit;
  font-weight: inherit;
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

@media (max-width: 540px) {
  .wrapper {
    padding: 10px 20px !important;
  }
}
</style>
