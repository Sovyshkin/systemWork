<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "VacancyEdit",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      title: "",
      desc: "",
      price: "",
      condition: "hour",
      message: "",
      id: "",
      vacancy: {},
    };
  },
  methods: {
    async load_info() {
      try {
        this.id = this.$route.query.id;
        if (this.id) {
          this.isLoading = true;
          let response = await axios.post(`/vacancies/get`, {
            id: this.id,
          });
          console.log(response);
          let vacancy = response.data.vacancy;
          if (vacancy) {
            this.title = vacancy.title;
            this.desc = vacancy.desc;
            this.price = vacancy.price;
            this.condition = vacancy.condition || "час";
            this.vacancy = vacancy;
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
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

    async save() {
      try {
        this.isLoading = true;
        let response = await axios.post(`/vacancies/edit`, {
          id: this.id,
          title: this.title,
          desc: this.desc,
          price: this.price,
          condition: this.condition,
        });
        console.log(response);
        this.message = response.data.message;
        setTimeout(() => {
          this.message = "";
          this.load_info();
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
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1>Редактирование вакансии</h1>
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
        <input
          type="number"
          name="price"
          id="price"
          v-model="price"
          placeholder="Введите цену"
        />
        <span class="group-value">Цена</span>
      </div>
      <div class="group">
        <select
          name="condition"
          id="condition"
          placeholder="Выберите"
          v-model="condition"
        >
          <option value="шт">шт</option>
          <option value="час">час</option>
        </select>
        <span class="group-value">Условия</span>
      </div>
    </div>
    <div class="wrap-btns">
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
</style>
