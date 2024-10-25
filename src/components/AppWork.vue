<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "AppWork",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      id: "",
      work: {},
      vacancies: [],
      categories: [],
      role: "",
      message: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        this.id = this.$route.query.id;
        let response = await axios.post(`/works/get`, {
          id: this.id,
        });
        console.log(response);
        this.work = response.data.work;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    async load_categories() {
      try {
        let response = await axios.post(`/categories/get/all`, {
          work_id: this.id,
        });
        console.log(response);
        this.categories = response.data.categories;
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

    async doneWork() {
      try {
        let response = await axios.post(`/works/done`, {
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
    this.load_categories();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1>{{ work.title }}</h1>
    <div class="wrap-btns" v-if="role == 'Администратор'">
      <button
        @click="$router.push({ name: 'work_edit', query: { id: this.id } })"
        class="btn"
      >
        Редактировать
      </button>
      <button @click="doneWork()" class="btn delete">Завершить</button>
    </div>
    <div class="info">
      <div class="desc">{{ work.desc }}</div>
      <div class="categories">
        <div class="info-item">Категории</div>
        <div
          @click="
            $router.push({ name: 'category', query: { id: category.id } })
          "
          class="category"
          v-for="category in categories"
          :key="category.id"
        >
          <span class="title">{{ category.title }}</span>
          <span class="vacancy-value"
            >Выполнено: {{ category.completed }}%</span
          >
          <span class="vacancy-value">Начислено: {{ category.accrued }}</span>
          <span class="vacancy-value">Выплачено: {{ category.paid }}</span>
          <span class="vacancy-value">Всего: {{ category.total }}</span>
        </div>
        <div class="not_found" v-if="categories.length == 0">
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

.work {
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
