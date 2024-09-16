<script>
export default {
  name: "AppFooter",
  components: {},
  data() {
    return {
      navs: [
        {
          name: "О нас",
          value: "aboutus",
        },
        {
          name: "Услуги",
          value: "services",
        },
        {
          name: "Отзывы",
          value: "comments",
        },
        {
          name: "Контакты",
          value: "contacts",
        },
        {
          name: "Филиалы",
          value: "branches",
        },
      ],
      contacts: [
        "+7 (922) 559-98-55",
        "Ленинская ул., 60, Оренбург",
        "Пн - Пт: 8:00 - 18:00",
        "ИНН 4039823979742",
        "ОГРН 48957495789034",
      ],
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
  },
  mounted() {},
};
</script>

<template>
  <div class="wrapper">
    <div class="logo-polic">
      <img
        class="logo"
        @click="this.$router.push({ name: 'main' })"
        src="../assets/logo.jpg"
        alt=""
      />
      <span class="text-polic" @click="this.$router.push({ name: 'politics' })"
        >Политика и конфиденциальность</span
      >
    </div>
    <nav class="group">
      <h3>Навигация</h3>
      <div class="wrap-items">
        <li
          class="nav-item"
          @click="scrollTo(item.value)"
          v-for="item in navs"
          :key="item.name"
        >
          {{ item.name }}
        </li>
      </div>
    </nav>
    <div class="contacts">
      <h3>Контакты</h3>
      <div class="wrap-contacts">
        <div class="contact" v-for="item in contacts" :key="item">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-evenly;
  gap: 25px;
  background-color: #35339b;
}

h3 {
  color: #ffffff;
  font-weight: 400;
  font-size: 30px;
  line-height: 30px;
}

.logo {
  max-height: 84px;
  max-width: 384px;
  cursor: pointer;
}

.group,
.contacts,
.wrap-contacts,
.wrap-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style-type: none;
}

.nav-item,
.contact {
  font-weight: 400;
  font-size: 21px;
  line-height: 21px;
  color: #fff;
  width: fit-content;
  cursor: pointer;
}

.logo-polic {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.text-polic {
  font-weight: 400;
  font-size: 21px;
  line-height: 21px;
  color: #fff;
  cursor: pointer;
  width: fit-content;
}

.nav-item::after,
.contact::after,
.text-polic::after {
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
.nav-item:focus:after,
.contact:focus::after,
.contact:hover::after,
.text-polic:focus::after,
.text-polic:hover::after {
  width: 100%;
}

@media (max-width: 800px) {
  h3 {
    font-size: 20px;
    line-height: 20px;
  }

  .nav-item,
  .contact,
  .text-polic {
    font-size: 14px;
    line-height: 14px;
  }
}

@media (max-width: 738px) {
  .wrapper {
    flex-direction: column;
    align-items: center;
  }

  .group,
  .contacts {
    align-items: center;
  }

  .wrap-contacts,
  .wrap-items {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .logo-polic {
    align-items: center;
    justify-content: center;
    gap: 15px;
  }
}

@media (max-width: 450px) {
  .logo {
    height: 60px;
    width: auto;
  }
}
</style>
