<script>
/* eslint-disable */
import axios from "axios";
export default {
  name: "CreateService",
  components: {},
  data() {
    return {
      id: "",
      title: "",
      desc: "",
      ru: "",
      country: "",
      img: "",
      files: [],
      message: "",
      show: false,
    };
  },
  methods: {
    async deleteService() {
      let response = await axios.post(`/delete_service`, {
        id: this.id,
      });
      this.message = response.data.message;
      if (this.message == "Услуга удалена") {
        setTimeout(() => {
          this.message = "";
          this.$router.go(-1);
        }, 2500);
      }
    },

    async deleteImage() {
      let response = await axios.post(`/delete_image`, {
        id: this.id,
      });
      this.message = response.data.message;
      if (this.message == "Изображение удалено") {
        setTimeout(() => {
          this.message = "";
          this.load_info();
        }, 1000);
      }
    },

    async submitFiles() {
      if (this.id) {
        let formData = new FormData();
        for (let i = 0; i < this.img.length; i++) {
          let file = this.img[i];
          formData.append("files", file);
        }
        if (this.country == "ru") {
          this.ru = true;
        } else {
          this.ru = false;
        }
        await axios
          .post("/edit_service", {
            title: this.title,
            desc: this.desc,
            ru: this.ru,
            id: this.id,
          })
          .then((e) => {
            console.log(`card creation return: ${e.data.text}`);

            let routeAppend = new String();

            console.log(`response info is: ${e.data.message}`);
            if (!isNaN(e.data.message)) routeAppend = `?id=${e.data.message}`;

            let uploadRoute = `/upload_one${routeAppend}`;

            console.log(`card creation response ${e.data.message}`);
            console.log(`upload route is ${uploadRoute}`);

            axios
              .post(uploadRoute, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((e) => {
                console.log(`got code 200 on upload: ${e.data.text}`);
              })
              .catch((e) => {
                console.log(`got code 400 on upload: ${e.data.text}`);
              });
            let message = e.data.message;
            if (message) {
              setTimeout(() => {
                this.error = "";
                this.status = "";
                this.$router.go(-1);
              }, 1000);
            }
          });
      } else {
        let formData = new FormData();
        for (let i = 0; i < this.img.length; i++) {
          let file = this.img[i];
          formData.append("files", file);
        }
        if (this.country == "ru") {
          this.ru = true;
        } else {
          this.ru = false;
        }
        await axios
          .post("/create_service", {
            title: this.title,
            desc: this.desc,
            ru: this.ru,
          })
          .then((e) => {
            console.log(`card creation return: ${e.data.text}`);

            let routeAppend = new String();

            console.log(`response info is: ${e.data.message}`);
            if (!isNaN(e.data.message)) routeAppend = `?id=${e.data.message}`;

            let uploadRoute = `/upload_one${routeAppend}`;

            console.log(`card creation response ${e.data.message}`);
            console.log(`upload route is ${uploadRoute}`);

            axios
              .post(uploadRoute, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((e) => {
                console.log(`got code 200 on upload: ${e.data.text}`);
              })
              .catch((e) => {
                console.log(`got code 400 on upload: ${e.data.text}`);
              });
            let message = e.data.message;
            if (message) {
              setTimeout(() => {
                this.error = "";
                this.status = "";
                this.$router.go(-1);
              }, 3000);
            }
          });
      }
    },
    handleFilesUpload() {
      this.img = this.$refs.files.files;
      console.log(this.img);
    },
    url(file) {
      try {
        return URL.createObjectURL(file);
      } catch (err) {
        this.show = true;
      }
    },

    async load_info() {
      let response = await axios.post(`/get_service`, {
        id: this.id,
      });
      console.log(response);
      this.title = response.data.title;
      this.desc = response.data.desc;
      this.img = response.data.img;
      this.ru = response.data.ru;
      if (this.ru) {
        this.country = "ru";
      } else {
        this.country = "ot";
      }
    },

    async vetifyToken() {
      let response = await axios.post(`/verify_token`, {
        token: localStorage.getItem("token"),
      });
      let message = response.data.message;
      if (message != "Успешно") {
        this.$router.push({ name: "main" });
      }
    },
  },
  async mounted() {
    this.vetifyToken();
    this.id = this.$route.query.id;
    if (this.id) {
      await this.load_info();
    }
  },
};
</script>

<template>
  <div class="wrapAdmin">
    <h1>Создание услуги</h1>
    <div class="img">
      <input
        type="file"
        ref="files"
        id="file"
        accept="image/*"
        v-on:change="handleFilesUpload"
      />
      <label for="file" v-if="!img"
        ><img src="../assets/add.png" alt=""
      /></label>
      <img
        :src="url(slide)"
        v-if="img && !show"
        alt=""
        v-for="slide in img"
        :key="slide"
        class="addedImg"
      />
      <img
        :src="'/assets/' + slide"
        v-if="img && show"
        alt=""
        v-for="slide in img"
        :key="slide"
        class="addedImg"
      />
      <button class="delete" @click="deleteImage" v-if="img">
        Удалить фото
      </button>
    </div>
    <div class="create">
      <input type="text" placeholder="Название" v-model="title" />
      <textarea
        name="note"
        id=""
        cols="30"
        rows="10"
        class="note"
        placeholder="Описание"
        v-model="desc"
      ></textarea>
      <select v-model="country">
        <option value="ru">Для граждан РФ</option>
        <option value="ot">Для иностранных граждан</option>
      </select>
      <div class="wrap_btn">
        <button class="deleteService" @click="deleteService">Удалить</button>
        <button @click="submitFiles">Сохранить</button>
      </div>
    </div>
    <div v-if="message" class="notification-container">
      <div :class="{ error: status == 400, success: status == 200 }">
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapAdmin {
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 100px;
}
select,
textarea {
  padding: 5px 10px;
  border: 1px solid black;
  border-radius: 5px;
}

textarea {
  min-width: 100px;
  max-width: 600px;
  min-height: 70px;
  max-height: 500px;
}
.notification-container {
  position: fixed;
  bottom: 3%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.success {
  background-color: #87e752;
  border-radius: 15px;
  padding: 7px 12px;
  color: #fff;
}
.error {
  background-color: #ed1c24;
  border-radius: 15px;
  padding: 7px 12px;
  color: #fff;
  font-weight: 550;
}
.create {
  margin: 0 auto;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

input {
  border: 1px solid black;
  padding: 5px 12px;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.wrap_btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.wrap_btn button {
  padding: 6px 13px;
  border: 1px solid black;
  border-radius: 5px;

  transition: all 400ms ease;
}

.wrap_btn button:hover {
  background-color: #89fc00;
  border: 1px solid #89fc00;
  transform: translateY(-4px);
}

h1 {
  font-size: 28px;
  line-height: 28px;
  font-weight: 400;
  text-align: center;
}

.img {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
}

#file {
  display: none;
}

label img {
  height: 50px;
  width: 50px;
  cursor: pointer;
}

.addedImg {
  max-height: 150px;
  border-radius: 5%;
  position: relative;
}

.deleteService {
  background-color: #ed1c24;
  color: #fff;
}

.deleteService:hover {
  color: black;
}
</style>
