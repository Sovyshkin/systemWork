<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "CreateUsers",
  components: { AppLoader },
  computed: {
    formatPhoneNumber() {
      return this.phone ? this.phone.replace(/[^+\d]/g, "") : "";
    },
  },
  data() {
    return {
      isLoading: false,
      name: "",
      surname: "",
      phone: "+7",
      message: "",
      role: "",
      id: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.id = this.$route.query.id;
        this.role = this.$route.query.role;
        if (this.id) {
          this.isLoading = true;
          let response = await axios.post(`/users/get`, {
            id: this.id,
          });
          console.log(response);
          let user = response.data.user;
          if (user) {
            this.name = user.name;
            this.surname = user.surname;
            this.phone = user.phone;
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },

    async create() {
      try {
        if (this.name && this.surname && this.phone) {
          this.isLoading = true;
          let response = await axios.post(`/users/create`, {
            name: this.name,
            surname: this.surname,
            phone: this.phone,
            role: this.role,
          });
          console.log(response);
          this.message = response.data.message;
          if (this.message == "Успешно") {
            setTimeout(() => {
              this.message = "";
              this.name = "";
              this.surname = "";
              this.phone = "";
              this.$router.go(-1);
            }, 2500);
          }
          setTimeout(() => {
            this.message = "";
          }, 2500);
        } else {
          this.message = "Заполните поля!";
          setTimeout(() => {
            this.message = "";
          }, 2500);
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
        let response = await axios.post(`/users/edit`, {
          id: this.id,
          name: this.name,
          surname: this.surname,
          phone: this.phone,
        });
        console.log(response);
        this.message = response.data.message;
        setTimeout(() => {
          this.message = "";
        }, 2500);
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
    updateValue(e) {
      let input = e.target.value.replace(/[^+\d]/g, "");
      if (!input.startsWith("+")) {
        input = "+";
      }
      this.phone = input;
      e.target.value = this.formatPhoneNumber;
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
    <h1 v-if="!this.id && role != 'Проверяющий'">Создание пользователя</h1>
    <h1 v-if="this.id && role != 'Проверяющий'">Редактирование пользователя</h1>
    <h1 v-if="!this.id && role == 'Проверяющий'">Создание проверяющего</h1>
    <h1 v-if="this.id && role == 'Проверяющий'">Редактирование проверяющего</h1>
    <div class="object">
      <div class="group">
        <input
          type="text"
          name="name"
          id="name"
          v-model="name"
          placeholder="Введите имя"
        />
        <span class="group-value">Имя</span>
      </div>
      <div class="group">
        <input
          type="text"
          name="surname"
          id="surname"
          v-model="surname"
          placeholder="Введите фамилию"
        />
        <span class="group-value">Фамилия</span>
      </div>
      <div class="group">
        <input
          :value="formatPhoneNumber"
          @input="updateValue($event)"
          type="tel"
          size="20"
          required
          name="number"
          placeholder="+7"
        />
        <span class="group-value">Номер телефона</span>
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
</style>
