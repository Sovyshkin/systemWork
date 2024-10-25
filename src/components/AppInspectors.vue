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
      role: "Проверяющий",
      message: "",
      inspectors: [],
      admin: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        let response = await axios.post(`/users/get/all`, {
          role: this.role,
        });
        console.log(response);
        this.inspectors = response.data.inspectors;
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
            if (this.admin != "Администратор") {
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
    <h1>Проверяющие</h1>
    <div class="wrap-btns" v-if="admin == 'Администратор'">
      <button
        @click="
          this.$router.push({
            name: 'create_users',
            query: { role: 'Проверяющий' },
          })
        "
        class="btn edit"
      >
        Создать
      </button>
    </div>
    <div class="users">
      <div class="user" v-for="inspector in inspectors" :key="inspector.id">
        <div class="info">
          <span class="title"
            >{{ inspector.name }} {{ inspector.surname }}</span
          >
          <span class="phone">{{ inspector.phone }}</span>
        </div>
        <div class="wrap-btn">
          <button
            @click="
              $router.push({ name: 'edit_users', query: { id: inspector.id } })
            "
            class="btn edit"
          >
            Редактировать
          </button>
          <button @click="goDelete(inspector.id)" class="btn delete">
            Удалить
          </button>
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

.wrapper-modal {
  position: absolute;
  height: 100vh;
  width: 100%;
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
}

.modal {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 32px;
  border-radius: 20px;
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 0 7px 7px #53515137;
}

.wrap-close {
  position: absolute;
  top: 3%;
  right: 2%;
  display: flex;
  justify-content: end;
  align-items: center;
}

.close {
  cursor: pointer;
  height: 24px;
  width: 24px;
}

.wrap-btns-modal {
  display: flex;
  align-items: center;
  gap: 15px;
}
</style>
