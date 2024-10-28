<script>
import AppLoader from "./AppLoader.vue";
import axios from "axios";
export default {
  name: "AppUsers",
  components: { AppLoader },
  data() {
    return {
      deleteID: "",
      isLoading: false,
      modal: false,
      role: "",
      message: "",
      admin: "",
      accrued: 0,
      paid: 0,
      total: 0,
      users: [],
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        let response = await axios.post(`/users/get/all`, {
          role: "Сотрудник",
        });
        console.log(response);
        this.users = response.data.users;
        this.accrued = response.data.accrued;
        this.paid = response.data.paid;
        this.total = response.data.total;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
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
            this.admin = response.data.role;
            if (this.admin != "Администратор" && this.admin != "Проверяющий") {
              this.$router.push({ name: "objects" });
            }
          }
        } else {
          this.$router.push({ name: "login" });
        }
      } catch (err) {
        console.log(err);
      }
    },

    async deleteUser() {
      try {
        let response = await axios.post(`/users/delete`, {
          id: this.deleteID,
        });
        console.log(response);
        this.message = response.data.message;
        setTimeout(() => {
          this.message = "";
          this.modal = false;
          this.load_info();
        }, 2500);
      } catch (err) {
        console.log(err);
      }
    },

    goDelete(id) {
      this.modal = true;
      this.deleteID = id;
    },
  },
  async mounted() {
    await this.checkVerify();
    this.load_info();
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
          <button @click="deleteUser(id)" class="btn edit">Да</button>
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
    <h1>Выплаты и начисления</h1>
    <div class="accuarls">
      <div class="group">
        <span class="item-group">На проверке</span>
        <span class="value-group">{{ accrued }}р</span>
      </div>
      <div class="group">
        <span class="item-group">К выплате</span>
        <span class="value-group">{{ paid }}р</span>
      </div>
      <div class="group">
        <span class="item-group">Начислено</span>
        <span class="value-group">{{ total }}р</span>
      </div>
    </div>
    <h1>Пользователи</h1>
    <div class="wrap-btns" v-if="admin == 'Администратор'">
      <button
        @click="this.$router.push({ name: 'create_users' })"
        class="btn edit"
      >
        Создать
      </button>
    </div>
    <div class="users" v-if="users.length > 0">
      <div class="user" v-for="user in users" :key="user.id">
        <div class="info">
          <span class="title">{{ user.name }} {{ user.surname }}</span>
          <span class="phone">{{ user.phone }}</span>
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
        </div>
        <div class="wrap-btn">
          <button
            @click="
              $router.push({ name: 'user_check', query: { id: user.id } })
            "
            class="btn"
          >
            К проверке
          </button>
          <button
            @click="
              $router.push({ name: 'edit_users', query: { id: user.id } })
            "
            class="btn edit"
          >
            Редактировать
          </button>
          <button @click="goDelete(user.id)" class="btn delete">Удалить</button>
        </div>
      </div>
    </div>
    <div class="not_found" v-if="users.length == 0">
      <span>Ничего не найдено</span>
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

.users {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.user {
  width: 100%;
  padding: 20px;
  border: 1px solid black;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.title,
.phone {
  font-size: 18px;
  line-height: 18px;
  font-weight: 500;
}

.wrap-btn {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  width: 100%;
  border-radius: 10px;
  background-color: #daca1a;
  padding: 12px 17px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.delete {
  background-color: #cf0032;
}

.edit {
  background-color: #3cca0d;
}

.accuarls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
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
</style>
