<script>
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/ru";

dayjs.locale("ru");

export default {
  name: "AppAdmin",
  components: {},
  data() {
    return {
      services: [],
    };
  },
  methods: {
    async getInfo() {
      let response = await axios.post(`/get_services`);
      this.services = response.data.services;
    },

    async vetifyToken() {
      let response = await axios.post(`/verify_token`, {
        token: localStorage.getItem("token"),
      });
      let message = response.data.message;
      if (message != "Успешно") {
        this.$router.push({ name: "main" });
      }
    },
  },
  async mounted() {
    this.vetifyToken();
    this.getInfo();
  },
};
</script>

<template>
  <div class="wrapAdmin">
    <h1>Услуги</h1>
    <div class="wrap_btn">
      <button
        @click="this.$router.push({ name: 'create' })"
        class="create_task"
      >
        Создать
      </button>
    </div>
    <div class="tasks">
      <div
        @click="this.$router.push({ name: 'create', query: { id: item.id } })"
        class="task"
        v-for="item in services"
        :key="item.id"
      >
        <div class="title">
          {{ item.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapAdmin {
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 100px;
}

h1 {
  font-size: 28px;
  line-height: 28px;
  font-weight: 400;
  text-align: center;
}
.info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.priority {
  font-size: small;
}
.wrap_btn {
  display: flex;
  justify-content: center;
}

.create_task {
  padding: 6px 13px;
  border: 1px solid black;
  border-radius: 5px;

  transition: all 400ms ease;
}

.create_task:hover {
  background-color: #89fc00;
  border: 1px solid #89fc00;
}

.tasks {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task {
  border: 1px solid black;
  padding: 10px 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  transition: all 400ms ease;
}

.task:hover,
.task:focus {
  transform: translateY(-5px);
}

.title {
  display: flex;
  flex-direction: column;
}

.date {
  font-size: small;
}
</style>
