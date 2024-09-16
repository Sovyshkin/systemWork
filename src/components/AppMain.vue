<script>
import AboutUs from "./AboutUs.vue";
import UsServices from "./UsServices.vue";
import AppComment from "./AppComment.vue";
import AppContacts from "./AppContacts.vue";
import AppBranches from "./AppBranches.vue";

export default {
  name: "AppMain",
  components: {
    AboutUs,
    UsServices,
    AppComment,
    AppContacts,
    AppBranches,
  },
};
</script>

<template>
  <div class="wrap">
    <AboutUs id="aboutus" style="max-width: 1440px" />
    <UsServices id="services" />
    <AppComment style="max-width: 1440px" id="comments" />
    <AppContacts style="max-width: 1440px" id="contacts" />
    <AppBranches style="max-width: 1440px" id="branches" />
  </div>
</template>

<style>
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
</style>
