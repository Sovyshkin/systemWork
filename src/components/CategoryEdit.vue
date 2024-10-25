<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "CategoryEdit",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      title: "",
      desc: "",
      vacancyTitle: "",
      subcategoryTitle: "",
      message: "",
      id: "",
      category: {},
      vacancies: [],
      subcategories: [],
      level: false,
      hours: 0,
      count: 0,
    };
  },
  methods: {
    async load_info() {
      try {
        this.id = this.$route.query.id;
        if (this.id) {
          this.isLoading = true;
          let response = await axios.post(`/categories/get`, {
            id: this.id,
          });
          console.log(response);
          let category = response.data.category;
          if (category) {
            this.title = category.title;
            this.desc = category.desc;
            this.count = category.count;
            this.hours = category.hours;
            this.level = category.level;
            this.category = category;
          }
        }
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
        this.level = true;
        this.subcategories = response.data.subcategories;
      } catch (err) {
        console.log(err);
      }
    },
    async checkVerify() {
      try {
        this.isLoading = true;
        let id = localStorage.getItem("id");
        let response = await axios.post(`/users/check_verify`, {
          id: id,
        });
        console.log(response);
        if (response.data.message != "ok") {
          this.$router.push({ name: "login" });
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },

    async createSubcategory() {
      try {
        if (this.subcategoryTitle) {
          let response = await axios.post(`/subcategories/add`, {
            category_id: this.id,
            title: this.subcategoryTitle,
          });
          console.log(response);
          this.message = response.data.message;
          if (this.message == "Успешно") {
            this.load_subcategories();
            setTimeout(() => {
              this.message = "";
            }, 1500);
          }
          setTimeout(() => {
            this.message = "";
          }, 3000);
        } else {
          this.message = "Заполните поле!";
          setTimeout(() => {
            this.message = "";
          }, 3000);
        }
      } catch (err) {
        console.log(err);
      }
    },

    async createvacancy() {
      try {
        if (this.vacancyTitle) {
          let response = await axios.post(`/vacancies/add`, {
            category_id: this.id,
            title: this.vacancyTitle,
          });
          console.log(response);
          this.message = response.data.message;
          if (this.message == "Успешно") {
            this.load_vacancies();
            setTimeout(() => {
              this.message = "";
            }, 1500);
          }
          setTimeout(() => {
            this.message = "";
          }, 3000);
        } else {
          this.message = "Заполните поле!";
          setTimeout(() => {
            this.message = "";
          }, 3000);
        }
      } catch (err) {
        console.log(err);
      }
    },

    async save() {
      try {
        this.isLoading = true;
        let response = await axios.post(`/categories/edit`, {
          id: this.id,
          title: this.title,
          desc: this.desc,
          level: this.level,
          hours: this.hours,
          count: this.count,
        });
        console.log(response);
        this.message = response.data.message;
        setTimeout(() => {
          this.message = "";
          this.load_info();
          if (this.category.level) {
            this.load_subcategories();
          } else {
            this.load_vacancies();
          }
        }, 1500);
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
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
    <h1>Редактирование категории</h1>
    <div class="object">
      <div class="group">
        <input
          type="text"
          name="title"
          id="title"
          v-model="title"
          placeholder="Введите название"
        />
        <span class="group-value">Название</span>
      </div>
      <div class="group">
        <textarea
          name="desc"
          id="desc"
          placeholder="Введите описание"
          v-model="desc"
        ></textarea>
        <span class="group-value">Описание</span>
      </div>
      <div class="group">
        <select name="level" id="level" placeholder="Выберите" v-model="level">
          <option :value="true">Да</option>
          <option :value="false">Нет</option>
        </select>
        <span class="group-value">Подкатегории</span>
      </div>
      <div class="group" v-if="!category.level">
        <input
          type="number"
          name="hours"
          id="hours"
          v-model="hours"
          placeholder="Введите количество работы в часах"
        />
        <span class="group-value">Количество работы в часах</span>
      </div>
      <div class="group" v-if="!category.level">
        <input
          type="number"
          name="count"
          id="count"
          v-model="count"
          placeholder="Введите количество работы в штуках"
        />
        <span class="group-value">Количество работы в штуках</span>
      </div>
      <div class="vacancies" v-if="id && !category.level">
        <div class="info-item">Вакансии</div>
        <div class="create-vacancy">
          <div class="group">
            <input
              type="text"
              name="title"
              id="title"
              v-model="vacancyTitle"
              placeholder="Введите название"
            />
            <span class="group-value">Название</span>
          </div>
          <button @click="createvacancy()" class="btn">Добавить</button>
        </div>
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
      </div>
      <div class="vacancies" v-if="id && category.level">
        <div class="info-item">Подкатегории</div>
        <div class="create-vacancy">
          <div class="group">
            <input
              type="text"
              name="title"
              id="title"
              v-model="subcategoryTitle"
              placeholder="Введите название"
            />
            <span class="group-value">Название</span>
          </div>
          <button @click="createSubcategory()" class="btn">Добавить</button>
        </div>
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
      </div>
    </div>
    <div class="wrap-btns">
      <button v-if="!message && !id" @click="create" class="btn">
        Создать
      </button>
      <button @click="save()" v-if="!message && id" class="btn">
        Сохранить
      </button>
      <div
        class="msg"
        :class="{
          success: this.message == 'Успешно',
          error: this.message != 'Успешно',
        }"
        v-if="message"
      >
        {{ message }}
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
}

.btn {
  background-color: #3cca0d;
  border-radius: 10px;
  padding: 17px 24px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 16px;
  outline: none;
}

textarea {
  max-width: 450px;
  max-height: 300px;
  min-height: 70px;
}

input::placeholder,
textarea::placeholder,
select::placeholder {
  color: #a5a5a5;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.12px;
}

.group {
  position: relative;
}

.group-value {
  position: absolute;
  top: 0;
  transform: translateY(-50%);
  left: 12px;
  background-color: #fff;
  padding: 0 4px;
  color: #a5a5a5;
  font-weight: 500;
  font-size: 10px;
  line-height: 13.66px;
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

.vacancies {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vacancy {
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

.vacancy:hover {
  transform: translateY(-5px);
}
.create-vacancy {
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
