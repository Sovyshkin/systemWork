<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "AppVacancy",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      id: "",
      vacancy: {},
      title: "",
      vacancies: [],
      role: "",
      message: "",
      userID: localStorage.getItem("id"),
      count: "",
      comment: "",
      executorName: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        this.id = this.$route.query.id;
        let response = await axios.post(`/vacancies/get`, {
          id: this.id,
        });
        console.log(response);
        this.vacancy = response.data.vacancy;
        if (this.vacancy.executor) {
          let res = await axios.post(`/users/get`, {
            id: this.vacancy.executor,
          });
          let user = res.data.user;
          this.executorName = user.name + " " + user.surname;
        }
        this.title = response.data.title;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    async checkVerify() {
      try {
        let id = localStorage.getItem("id");
        this.userID = id;
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

    async finish() {
      try {
        if (this.count) {
          let response = await axios.post(`/vacancies/finish`, {
            id: this.id,
            userID: this.userID,
            count: this.count,
            comment: this.comment,
          });
          console.log(response);
          this.message = response.data.message;
          setTimeout(() => {
            this.message = "";
            this.$router.go(-1);
          }, 2500);
        } else {
          this.message = "Заполните количество!";
          setTimeout(() => {
            this.message = "";
          }, 2500);
        }
      } catch (err) {
        console.log(err);
      }
    },

    async accept() {
      try {
        let response = await axios.post(`/vacancies/accept`, {
          id: this.id,
          userID: this.userID,
        });
        console.log(response);
        this.message = response.data.message;
        setTimeout(() => {
          this.message = "";
          this.load_info();
        }, 2500);
      } catch (err) {
        console.log(err);
      }
    },

    async refuse() {
      try {
        let response = await axios.post(`/vacancies/refuse`, {
          id: this.id,
          userID: this.userID,
        });
        console.log(response);
        this.message = response.data.message;
        setTimeout(() => {
          this.message = "";
          this.load_info();
        }, 2500);
      } catch (err) {
        console.log(err);
      }
    },
    async doneVacancy() {
      try {
        let response = await axios.post(`/vacancies/done`, {
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
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <div class="wrap-title">
      <h1>Вакансия</h1>
      <div class="executor you" v-if="vacancy.executor == userID">
        Вы исполнитель
      </div>
      <div class="executor no" v-else-if="!vacancy.executor">
        Нет исполнителя
      </div>
      <div class="executor other" v-else>Исполнитель не вы!</div>
    </div>
    <div class="wrap-btns" v-if="role == 'Администратор'">
      <button
        @click="$router.push({ name: 'edit_vacancy', query: { id: this.id } })"
        class="btn"
      >
        Редактировать
      </button>
      <button @click="doneVacancy()" class="btn delete">Завершить</button>
    </div>
    <div class="info">
      <div class="group-info" v-if="vacancy.desc">
        <span class="item-group">Описание:</span>
        <p class="value-group">{{ vacancy.desc }}</p>
      </div>
      <div class="group-info">
        <span class="item-group">Условия:</span>
        <span class="value-group"
          >{{ vacancy.price }}р/{{ vacancy.condition }}</span
        >
      </div>
      <div class="group-info">
        <span class="item-group">Исполнитель:</span>
        <span class="value-group" v-if="vacancy.executor">{{
          executorName
        }}</span>
        <span class="value-group" v-else>Не назначен</span>
      </div>
    </div>
    <div class="send-job" v-if="vacancy.executor == userID">
      <div class="group">
        <input
          type="number"
          name="count"
          id="count"
          v-model="count"
          min="0"
          placeholder="Введите количество"
        />
        <span class="group-value">Количество</span>
      </div>
      <div class="group">
        <textarea
          name="comment"
          id="comment"
          placeholder="Введите комментарий"
          v-model="comment"
        ></textarea>
        <span class="group-value">Комментарий</span>
      </div>
      <button @click="finish()" class="btn">Списать работу</button>
    </div>
    <div class="wrap-btns-job">
      <button
        @click="refuse()"
        v-if="vacancy.executor == userID"
        class="btn refuse"
      >
        Отказаться
      </button>
      <button
        @click="accept()"
        v-else-if="!vacancy.executor"
        class="btn accept"
      >
        Взять в работу
      </button>
      <button v-else class="btn not_available">Не доступно</button>
    </div>
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

.vacancy {
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

.wrap-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.executor {
  padding: 10px;
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  color: #fff;
  border-radius: 10px;
}

.you,
.accept {
  background-color: #3cca0d;
  border: none;
  color: #fff;
}

.no,
.refuse {
  background-color: #cf0032;
  border: none;
  color: #fff;
}

.other,
.not_available {
  background-color: #daca1a;
  border: none;
  color: #fff;
}

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.group-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.item-group {
  border-bottom: 1px solid black;
  padding-bottom: 2px;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
}

.value-group {
  font-weight: 400;
  font-size: 16px;
}

.wrap-btns-job {
  display: flex;
  align-items: center;
  justify-content: center;
}
input,
textarea {
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
textarea::placeholder {
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

.send-job {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
