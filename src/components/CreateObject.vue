<script>
import axios from "axios";
import AppLoader from "./AppLoader.vue";
export default {
  name: "CreateObjects",
  components: { AppLoader },
  data() {
    return {
      isLoading: false,
      title: "",
      desc: "",
      workTitle: "",
      message: "",
      works: [],
      id: "",
    };
  },
  methods: {
    async load_info() {
      try {
        this.id = this.$route.query.id;
        if (this.id) {
          this.isLoading = true;
          let response = await axios.post(`/objects/get`, {
            id: this.id,
          });
          console.log(response);
          let object = response.data.object;
          if (object) {
            this.title = object.title;
            this.desc = object.desc;
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },

    async load_works() {
      try {
        let response = await axios.post(`/works/get/all`, {
          object_id: this.id,
        });
        console.log(response);
        this.works = response.data.works;
      } catch (err) {
        console.log(err);
      }
    },

    async create() {
      try {
        if (this.title && this.desc) {
          this.isLoading = true;
          let response = await axios.post(`/objects/create`, {
            title: this.title,
            desc: this.desc,
          });
          console.log(response);
          this.message = response.data.message;
          if (this.message == "Успешно") {
            setTimeout(() => {
              this.message = "";
              this.title = "";
              this.desc = "";
              this.$router.go(-1);
            }, 2500);
          }
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

    async createWork() {
      try {
        if (this.workTitle) {
          let response = await axios.post(`/works/create`, {
            object_id: this.id,
            title: this.workTitle,
          });
          console.log(response);
          this.message = response.data.message;
          if (this.message == "Успешно") {
            this.load_works();
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
        let response = await axios.post(`/objects/edit`, {
          id: this.id,
          title: this.title,
          desc: this.desc,
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
  },
  mounted() {
    this.checkVerify();
    this.load_info();
    this.load_works();
  },
};
</script>
<template>
  <AppLoader v-if="isLoading" />
  <div class="wrapper" v-else>
    <h1 v-if="!this.id">Создание объекта</h1>
    <h1 v-else>Редактирование объекта</h1>
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
      <div class="works" v-if="id">
        <div class="info-item">Работы</div>
        <div class="create-work">
          <div class="group">
            <input
              type="text"
              name="title"
              id="title"
              v-model="workTitle"
              placeholder="Введите название"
            />
            <span class="group-value">Название</span>
          </div>
          <button @click="createWork()" class="btn">Добавить</button>
        </div>
        <div
          @click="$router.push({ name: 'work', query: { id: work.id } })"
          class="work"
          v-for="work in works"
          :key="work.id"
        >
          <span class="title">{{ work.title }}</span>
          <span class="vacancy-value">Выполнено: {{ work.completed }}%</span>
          <span class="vacancy-value">Начислено: {{ work.accrued }}</span>
          <span class="vacancy-value">Выплачено: {{ work.paid }}</span>
          <span class="vacancy-value">Всего: {{ work.total }}</span>
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

.vacancy-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
}
</style>
