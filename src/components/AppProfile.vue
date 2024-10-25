<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "AppProfile",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      user: {},
      vacancies: [],
      id: "",
      message: "",
      role: "",
      modal: false,
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        let response = await axios.post(`/users/get`, {
          id: this.id,
        });
        console.log(response);
        this.user = response.data.user;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    async load_active() {
      try {
        this.isLoading = true;
        let response = await axios.post(`/vacancies/active`, {
          userID: this.id,
        });
        console.log(response);
        this.vacancies = response.data.vacancies;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    async checkVerify() {
      try {
        this.id = localStorage.getItem("id");
        if (this.id) {
          let response = await axios.post(`/users/check_verify`, {
            id: this.id,
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

    goName(name) {
      console.log(name);
      this.$router.push({ name: name });
    },

    exit() {
      localStorage.clear();
      this.$router.push({ name: "login" });
    },
  },
  mounted() {
    this.checkVerify();
    this.load_info();
    this.load_active();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <div class="wrapper-modal" v-if="modal">
      <div class="modal">
        <div class="wrap-close">
          <img
            @click="modal = false"
            class="close"
            src="../assets/close.png"
            alt=""
          />
        </div>
        <h1>Вы уверены?</h1>
        <div class="wrap-btns-modal" v-if="!message">
          <button @click="exit()" class="btn edit">Да</button>
          <button @click="modal = false" class="btn delete">Нет</button>
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
    </div>
    <h1>Профиль</h1>
    <div class="wrap-btns-admin">
      <button
        @click="goName('users')"
        v-if="role == 'Администратор' || role == 'Проверяющий'"
        class="btn users"
      >
        Пользователи
      </button>
      <button
        @click="goName('inspectors')"
        v-if="role == 'Администратор'"
        class="btn inspectors"
      >
        Проверяющие
      </button>
      <button
        @click="goName('objects')"
        v-if="role == 'Администратор' || role == 'Проверяющий'"
        class="btn objects"
      >
        Объекты
      </button>
    </div>
    <div class="info">
      <div class="group">
        <span class="item-group">Имя</span>
        <span class="value-group">{{ user.name }}</span>
      </div>
      <div class="group">
        <span class="item-group">Фамилия</span>
        <span class="value-group">{{ user.surname }}</span>
      </div>
      <div class="group">
        <span class="item-group">Телефон</span>
        <span class="value-group">{{ user.phone }}</span>
      </div>
    </div>
    <h2>Выплаты и начисления</h2>
    <div class="accuarls">
      <div class="group">
        <span class="item-group">На проверке</span>
        <span class="value-group">{{ user.accrued }}р</span>
      </div>
      <div class="group">
        <span class="item-group">К выплате</span>
        <span class="value-group">{{ user.paid }}р</span>
      </div>
      <div class="group">
        <span class="item-group">Начислено</span>
        <span class="value-group">{{ user.total }}р</span>
      </div>
    </div>
    <h2 v-if="role == 'Сотрудник'">Активные работы</h2>
    <div class="vacancies" v-if="vacancies.length > 0 && role == 'Сотрудник'">
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
    <div class="not_found" v-if="vacancies.length == 0 && role == 'Сотрудник'">
      <span>Ничего не найдено</span>
    </div>
    <div class="wrap-btns">
      <button
        @click="$router.push({ name: 'archive' })"
        v-if="role == 'Сотрудник'"
        class="btn"
      >
        Архив работ
      </button>
      <button @click="modal = true" class="btn delete">Выйти</button>
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

.info,
.accuarls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.group {
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

.wrap-btns {
  display: flex;
  align-items: center;
  gap: 15px;
}

.wrap-btns-admin {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.btn {
  border-radius: 10px;
  box-shadow: 0 0 7px 7px #53515137;
  border: 1px solid black;
  padding: 17px 24px;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.delete {
  background-color: #cf0032;
  color: #fff;
  border: none;
  box-shadow: none;
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

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
}

@media (max-width: 600px) {
  .wrap-btns-admin {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
