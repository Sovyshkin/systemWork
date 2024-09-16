<script>
export default {
  name: "AppHeader",
  components: {},
  data() {
    return {
      menu: false,
    };
  },
  methods: {
    scrollTo(name) {
      const element = document.getElementById(name);
      if (element) {
        window.scrollTo({ top: element.offsetTop - 90, behavior: "smooth" });
      } else {
        location.reload();
      }
    },

    clickMenu() {
      let group = document.querySelector(".group");
      if (!this.menu) {
        group.style.opacity = 1;
        group.style.display = "flex";
        this.menu = true;
      } else {
        group.style.opacity = 0;
        group.style.display = "none";
        this.menu = false;
      }
    },
  },
  mounted() {},
};
</script>

<template>
  <div class="wrapper">
    <img
      src="../assets/logo.jpg"
      @click="this.$router.push({ name: 'main' })"
      alt=""
      class="logo"
    />
    <img class="menu" @click="clickMenu" src="../assets/menu.png" alt="" />
    <nav class="group">
      <li class="nav-item" @click="scrollTo('aboutus')">О нас</li>
      <li class="nav-item" @click="scrollTo('services')">Услуги</li>
      <li class="nav-item" @click="scrollTo('comments')">Отзывы</li>
      <li class="nav-item" @click="scrollTo('contacts')">Контакты</li>
      <li class="nav-item" @click="scrollTo('branches')">Филиалы</li>
    </nav>
  </div>
</template>

<style scoped>
.wrapper {
  position: fixed;
  width: 100%;
  padding: 10px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #35339b;
  z-index: 2;
}

.group {
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 400ms ease;
}

.logo {
  height: 48px;
  width: 233px;
  cursor: pointer;
}

.nav-item {
  font-size: 18px;
  font-weight: 400;
  line-height: 18px;
  color: #fff;
  list-style-type: none;
  cursor: pointer;
}

.nav-item::after {
  margin-top: 2px;
  background-color: #fff; /* Цвет линии при наведении на нее курсора мыши */
  display: block;
  content: "";
  height: 2px; /* Высота линии */
  width: 0%;
  -webkit-transition: width 0.3s ease-in-out;
  -moz--transition: width 0.3s ease-in-out;
  transition: width 0.3s ease-in-out;
}
.nav-item:hover:after,
.nav-item:focus:after {
  width: 100%;
}

.menu {
  height: 30px;
  width: 30px;
  cursor: pointer;
  display: none;
}

@media (max-width: 830px) {
  .group {
    position: absolute;
    right: 2%;
    bottom: 1;
    background-color: #35339b;
    transform: translateY(100px);
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-radius: 20px;
    display: none;
    opacity: 0;
  }

  .menu {
    display: block;
  }
}
</style>
