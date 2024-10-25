<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "AppSubcategory",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      id: "",
      subcategory: {},
      title: "",
      vacancies: [],
      role: "",
      message: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        this.id = this.$route.query.id;
        let response = await axios.post(`/subcategories/get`, {
          id: this.id,
        });
        console.log(response);
        this.subcategory = response.data.subcategory;
        this.title = response.data.title;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    async load_vacancies() {
      try {
        let response = await axios.post(`/vacancies/get/all`, {
          subcategory_id: this.id,
        });
        console.log(response);
        this.vacancies = response.data.vacancies;
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
    async doneSubcategory() {
      try {
        let response = await axios.post(`/subcategories/done`, {
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
  async mounted() {
    this.checkVerify();
    await this.load_info();
    this.load_vacancies();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1>{{ title }}</h1>
    <h2>{{ subcategory.title }}</h2>
    <div class="wrap-btns" v-if="role == 'Администратор'">
      <button
        @click="
          $router.push({ name: 'subcategory_edit', query: { id: this.id } })
        "
        class="btn"
      >
        Редактировать
      </button>
      <button @click="doneSubcategory()" class="btn delete">Завершить</button>
    </div>
    <div class="info">
      <div class="desc">{{ subcategory.desc }}</div>
      <div class="info-item">Cтатистика</div>
      <div class="work-in">
        <div class="info-item">Работа в часах</div>
        <div class="group">
          <span
            >Выполнено {{ subcategory.hours_completed }} из
            {{ subcategory.hours }}</span
          >
        </div>
      </div>
      <div class="work-in">
        <div class="info-item">Работа в штуках</div>
        <div class="group">
          <span
            >Выполнено {{ subcategory.count_completed }} из
            {{ subcategory.count }}</span
          >
        </div>
      </div>
      <div class="vacancies" v-if="id">
        <div class="info-item">Вакансии</div>
        <div
          @click="$router.push({ name: 'vacancy', query: { id: vacancy.id } })"
          class="vacancy"
          v-for="vacancy in vacancies"
          :key="vacancy.id"
        >
          <span class="title">{{ vacancy.title }}</span>
          <span class="vacancy-value"
            >Условия: {{ vacancy.price }}р/{{ vacancy.condition }}</span
          >
          <span class="vacancy-value"
            >Исполнитель:
            <b v-if="vacancy.executor">{{
              vacancy.executorName + " " + vacancy.executorSurname
            }}</b>
            <b v-else>Не назначен</b></span
          >
        </div>
        <div class="not_found" v-if="vacancies.length == 0">
          <span>Ничего не найдено</span>
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

.category {
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

.vacancies,
.categories {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vacancy,
.category {
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

.category:hover {
  transform: translateY(-5px);
}
.create-category {
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

.work-in {
  padding: 10px;
  border: 1px dashed black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
