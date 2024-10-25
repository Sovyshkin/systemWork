<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "AppObject",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      id: "",
      object: {},
      works: [],
      role: "",
      message: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        this.id = this.$route.query.id;
        let response = await axios.post(`/objects/get`, {
          id: this.id,
        });
        console.log(response);
        this.object = response.data.object;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    async load_works() {
      try {
        let response = await axios.post(`/works/get/all`, {
          object_id: this.id,
        });
        console.log(response);
        this.works = response.data.works;
      } catch (err) {
        console.log(err);
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

    async doneObject() {
      try {
        let response = await axios.post(`/objects/done`, {
          id: this.id,
        });
        console.log(response);
        this.message = response.data.message;
        if (this.message == "Успешно") {
          setTimeout(() => {
            this.message = "";
          }, 1500);
        }
        setTimeout(() => {
          this.message = "";
        }, 3000);
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    this.checkVerify();
    this.load_info();
    this.load_works();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1>{{ object.title }}</h1>
    <div class="wrap-btns" v-if="role == 'Администратор'">
      <button
        @click="
          $router.push({ name: 'create_objects', query: { id: object.id } })
        "
        class="btn"
      >
        Редактировать
      </button>
      <button @click="doneObject()" class="btn delete">Завершить</button>
    </div>
    <div class="info">
      <div class="info-item">Описание</div>
      <div class="desc">{{ object.desc }}</div>
      <div class="works" v-if="id">
        <div class="info-item">Работы</div>
        <div
          @click="$router.push({ name: 'work', query: { id: work.id } })"
          class="work"
          v-for="work in works"
          :key="work.id"
        >
          <span class="title">{{ work.title }}</span>
          <span class="vacancy-value">Выполнено: {{ work.completed }}%</span>
          <span class="vacancy-value">Начислено: {{ work.accrued }}</span>
          <span class="vacancy-value">Выплачено: {{ work.paid }}</span>
          <span class="vacancy-value">Всего: {{ work.total }}</span>
        </div>
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

.object {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 450px;
}

.wrap-btns {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.btn {
  border-radius: 10px;
  padding: 12px 17px;
  color: black;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  border: 1px solid black;
}

.delete {
  background-color: #cf0032;
  color: #fff;
  border: 1px solid #cf0032;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.info-item {
  margin: 0 auto;
  width: fit-content;
  text-align: center;
  border-bottom: 1px solid black;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
}

.works {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.work {
  display: flex;
  flex-direction: column;
  border: 1px solid #00000037;
  border-radius: 15px;
  padding: 15px;
  gap: 10px;
  cursor: pointer;
  transition: all 500ms ease;
  box-shadow: 0 0 10px 0 #00000037;
}

.work:hover {
  transform: translateY(-5px);
}
.create-work {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
}

.desc {
  font-family: 500;
  font-size: 16px;
  line-height: 16px;
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
