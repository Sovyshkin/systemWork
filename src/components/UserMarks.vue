<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "UserMarks",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      user: {},
      marks: [],
      id: "",
      message: "",
      role: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.id = this.$route.query.id;
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

    async load_marks() {
      try {
        let response = await axios.post(`/marks/get/all`, {
          userID: this.id,
        });
        console.log(response);
        this.marks = response.data.marks;
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

    goName(name) {
      console.log(name);
      this.$router.push({ name });
    },
  },
  mounted() {
    this.checkVerify();
    this.load_info();
    this.load_marks();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1>Календарь отметок</h1>
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
    <div class="marks" v-if="marks.length > 0">
      <div class="mark" v-for="mark in marks" :key="mark.id">
        {{ mark.date }} - списал {{ mark.count }} работ
      </div>
    </div>
    <div class="not_found" v-if="marks.length == 0">
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
h1 {
  margin-bottom: 50px;
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

.wrap-btns-admin {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.btn {
  width: 100%;
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

.marks {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.mark {
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
}
</style>
