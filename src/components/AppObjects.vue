<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "AppObjects",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      objects: [],
      role: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        let response = await axios.post(`/objects/get/all`);
        this.objects = response.data.objects;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    async checkVerify() {
      try {
        let id = localStorage.getItem("id");
        if (id) {
          let response = await axios.post(`/users/check_verify`, {
            id: id,
          });
          console.log(response);
          if (response.data.message != "ok") {
            this.$router.push({ name: "login" });
          } else {
            this.role = response.data.role;
          }
        } else {
          this.$router.push({ name: "login" });
        }
      } catch (err) {
        console.log(err);
      }
    },
    goObject(id) {
      this.$router.push({ name: "object", query: { id: id } });
    },
  },
  mounted() {
    this.checkVerify();
    this.load_info();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1>Объекты</h1>
    <div class="wrap-btns" v-if="role == 'Администратор'">
      <button
        @click="this.$router.push({ name: 'create_objects' })"
        class="btn"
      >
        Создать
      </button>
    </div>
    <div class="objects">
      <div
        class="object"
        v-for="item in objects"
        :key="item.id"
        @click="goObject(item.id)"
      >
        <span class="title">{{ item.title }}</span>
        <span class="vacancy-value">Выполнено: {{ item.completed }}%</span>
        <span class="vacancy-value">Начислено: {{ item.accrued }}</span>
        <span class="vacancy-value">Выплачено: {{ item.paid }}</span>
        <span class="vacancy-value">Всего: {{ item.total }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 40px;
}

.objects {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
}

.object {
  flex: 25%;
  padding: 10px 20px;
  border: 1px solid black;
  border-radius: 15px;
  transition: all 500ms ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.object:hover {
  transform: translateY(-3px);
}

.btn {
  width: 100%;
  background-color: #3cca0d;
  border-radius: 10px;
  padding: 12px 17px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.total {
  width: fit-content;
  background-color: #45ed0b;
  color: #fff;
  font-weight: 500;
  padding: 5px 7px;
  border-radius: 10px;
}

.vacancy-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
}
</style>
