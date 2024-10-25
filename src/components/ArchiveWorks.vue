<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "ArchiveWorks",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      id: "",
      vacancies: [],
      role: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.isLoading = true;
        let response = await axios.post(`/vacancies/get/all`, {
          archive: true,
          userID: this.id,
        });
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
    goVacancy(id) {
      this.$router.push({ name: "vacancy", query: { id: id } });
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
    <h1>Архив работ</h1>
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

.objects {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
}

.object {
  flex: 25%;
  padding: 10px 20px;
  border: 1px solid black;
  border-radius: 15px;
  transition: all 500ms ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.object:hover {
  transform: translateY(-3px);
}

.btn {
  width: 100%;
  background-color: #3cca0d;
  border-radius: 10px;
  padding: 12px 17px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
}

.total {
  width: fit-content;
  background-color: #45ed0b;
  color: #fff;
  font-weight: 500;
  padding: 5px 7px;
  border-radius: 10px;
}

.vacancy-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
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

.title {
  font-weight: 600;
  font-size: 20px;
  line-height: 20px;
}
</style>
