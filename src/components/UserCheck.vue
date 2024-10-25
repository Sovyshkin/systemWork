<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "UserCheck",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      user: {},
      vacancies: [],
      id: "",
      message: "",
      role: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        this.id = this.$route.query.id;
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

    async load_objects() {
      try {
        let response = await axios.post(`/vacancies/check/get/all`, {
          id: this.id,
        });
        this.vacancies = response.data.vacancies;
        for (let i = 0; i < this.vacancies.length; i++) {
          this.vacancies[i].input =
            this.vacancies[i].price * this.vacancies[i].count;
        }
      } catch (err) {
        console.log(err);
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

    async payAccrued(id, amount) {
      try {
        if (id && amount) {
          let response = await axios.post(`/vacancies/pay/accrued`, {
            id,
            amount,
          });
          console.log(response);
          this.message = response.data.message;
          if (this.message == "Успешно") {
            setTimeout(() => {
              this.load_info();
              this.load_objects();
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

    async payTotal() {
      let response = await axios.post(`/users/pay/total`, {
        id: this.id,
      });
      console.log(response);
      this.message = response.data.message;
      if (this.message == "Успешно") {
        setTimeout(() => {
          this.load_info();
          this.message = "";
        }, 1500);
      }
      setTimeout(() => {
        this.message = "";
      }, 3000);
    },
  },
  async mounted() {
    this.checkVerify();
    await this.load_info();
    await this.load_objects();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1>Проверка</h1>
    <div class="wrap-btns">
      <button
        @click="$router.push({ name: 'user_marks', query: { id: this.id } })"
        class="btn"
      >
        Просмотреть календарь отметок
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
    <div class="wrap-accuarls">
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
      <button class="btn pay" @click="payTotal()">Оплатить</button>
    </div>
    <h2>Объекты к проверке</h2>
    <div class="vacancies" v-if="vacancies.length > 0">
      <div class="wrap-vacancy" v-for="vacancy in vacancies" :key="vacancy.id">
        <div class="vacancy">
          <span class="title">{{ vacancy.object_title }}</span>
          <span class="vacancy-value"
            >Условия работы: {{ vacancy.title }} - {{ vacancy.price }}р/{{
              vacancy.condition
            }}
          </span>
          <span class="vacancy-value"
            >Работ выполнено: {{ vacancy.count }}</span
          >
        </div>
        <div class="group-input">
          <input type="number" v-model="vacancy.input" />
          <button
            @click="payAccrued(vacancy.id, vacancy.input)"
            class="btn pay"
          >
            Зачислить
          </button>
        </div>
      </div>
    </div>
    <div class="not_found" v-if="vacancies.length == 0">
      <span>Ничего не найдено</span>
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
h1 {
  margin-bottom: 50px;
}

.wrap-accuarls {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 20px;
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
  gap: 10px;
}
.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
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

.wrap-vacancy {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.group-input {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 20px;
}

input {
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  padding: 16px;
  outline: none;
}

input::placeholder {
  color: #a5a5a5;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.12px;
}

.pay {
  background-color: #3cca0d;
  color: #fff;
  border: none;
  box-shadow: none;
}

.msg {
  position: fixed;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
}
</style>
