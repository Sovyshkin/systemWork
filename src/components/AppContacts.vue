<script>
export default {
  name: "AppContacts",
  components: {},
  data() {
    return {
      contacts: [
        {
          name: "Телефон:",
          text: "+7 (922) 559-98-55",
        },
        {
          name: "Адрес:",
          text: "Ленинская ул., 60, Оренбург",
        },
        {
          name: "Режим работы:",
          text: "Пн - Пт: 8:00 - 18:00",
        },
      ],
    };
  },
  methods: {},
  mounted() {},
};
</script>

<template>
  <div class="wrapper">
    <h1>Контакты</h1>
    <div class="contacts">
      <div class="contact" v-for="item in contacts" :key="item.name">
        <div class="name">{{ item.name }}</div>
        <span>{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  padding: 10px 40px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

h1 {
  color: #35339b;
  font-size: 62px;
  line-height: 62px;
  font-weight: 400;
}

.contacts {
  border-left: 4px solid #35339b;
  padding-left: 20px;
  margin: 0 auto;
  transform: translateX(100px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
}

.contact {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.name {
  color: #35339b;
  font-weight: 400;
  font-size: 33px;
  line-height: 33px;
}

span {
  color: #686868;
  font-size: 20px;
  line-height: 20px;
  font-weight: 400;
}

@media (max-width: 800px) {
  h1 {
    font-size: 40px;
    line-height: 40px;
  }

  .name {
    font-size: 25px;
    line-height: 20px;
  }

  span {
    font-size: 16px;
    line-height: 16px;
  }

  .left,
  .right {
    gap: 15px;
  }
}

@media (max-width: 500px) {
  .contacts {
    transform: none;
  }
}
</style>
