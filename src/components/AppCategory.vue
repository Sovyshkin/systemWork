<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "AppCategory",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      id: "",
      category: {},
      title: "",
      vacancies: [],
      subcategories: [],
      role: "",
      message: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        this.id = this.$route.query.id;
        let response = await axios.post(`/categories/get`, {
          id: this.id,
        });
        console.log(response);
        this.category = response.data.category;
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
          category_id: this.id,
        });
        console.log(response);
        this.vacancies = response.data.vacancies;
      } catch (err) {
        console.log(err);
      }
    },

    async load_subcategories() {
      try {
        let response = await axios.post(`/subcategories/get/all`, {
          category_id: this.id,
        });
        console.log(response);
        this.subcategories = response.data.subcategories;
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

    async doneCategory() {
      try {
        let response = await axios.post(`/categories/done`, {
          id: this.id,
        });
        console.log(response);
        this.message = response.data.message;
        if (this.message == "Успешно") {
          this.load_categories();
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
    if (this.category.level) {
      this.load_subcategories();
    } else {
      this.load_vacancies();
    }
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1>{{ title }}</h1>
    <h2>{{ category.title }}</h2>
    <div class="wrap-btns" v-if="role == 'Администратор'">
      <button
        @click="$router.push({ name: 'category_edit', query: { id: this.id } })"
        class="btn"
      >
        Редактировать
      </button>
      <button @click="doneCategory()" class="btn delete">Завершить</button>
    </div>
    <div class="info">
      <div class="desc">{{ category.desc }}</div>
      <div class="info-item" v-if="!category.level">Cтатистика</div>
      <div class="work-in" v-if="!category.level">
        <div class="info-item">Работа в часах</div>
        <div class="group">
          <span
            >Выполнено {{ category.hours_completed }} из
            {{ category.hours }}</span
          >
        </div>
      </div>
      <div class="work-in" v-if="!category.level">
        <div class="info-item">Работа в штуках</div>
        <div class="group">
          <span
            >Выполнено {{ category.count_completed }} из
            {{ category.count }}</span
          >
        </div>
      </div>
      <div class="vacancies" v-if="id && !category.level">
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
      <div class="vacancies" v-if="id && category.level">
        <div class="info-item">Подкатегории</div>
        <div
          @click="
            $router.push({ name: 'subcategory', query: { id: subcategory.id } })
          "
          class="vacancy"
          v-for="subcategory in subcategories"
          :key="subcategory.id"
        >
          <span class="title">{{ subcategory.title }}</span>
          <span class="vacancy-value"
            >Выполнено: {{ subcategory.completed }}%</span
          >
          <span class="vacancy-value"
            >Начислено: {{ subcategory.accrued }}</span
          >
          <span class="vacancy-value">Выплачено: {{ subcategory.paid }}</span>
          <span class="vacancy-value">Всего: {{ subcategory.total }}</span>
        </div>
        <div class="not_found" v-if="subcategories.length == 0">
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

.vacancy-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
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
