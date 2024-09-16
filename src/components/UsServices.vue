<script>
import axios from "axios";
export default {
  name: "UsServices",
  components: {},
  data() {
    return {
      ru1: [],
      ru2: [],
      ot1: [],
      ot2: [],
    };
  },
  methods: {
    async load_info() {
      let res1 = await axios.post(`/get_services`, {
        ru: true,
      });
      let servicesRu = res1.data.services;
      if (servicesRu.length > 4) {
        this.ru1 = servicesRu.slice(0, 4);
        this.ru2 = servicesRu.slice(4, 8);
      } else {
        this.ru1 = servicesRu.slice(0, 10);
        this.ru2 = [];
      }
      let res2 = await axios.post(`/get_services`, {
        ru: false,
      });
      let services = res2.data.services;
      if (services.length > 10) {
        this.ot1 = services.slice(0, 10);
        this.ot2 = services.slice(10, 20);
      } else {
        this.ot1 = services.slice(0, 10);
        this.ot2 = [];
      }
    },
  },
  mounted() {
    this.load_info();
  },
};
</script>

<template>
  <div class="wrapper">
    <div class="wrap-info">
      <h1>Услуги компании</h1>
      <h2>Для иностранных граждан:</h2>
      <div class="services eu">
        <div class="left bx" v-if="ot1.length > 0">
          <span
            @click="
              this.$router.push({ name: 'service', query: { id: item.id } })
            "
            v-for="item in ot1"
            :key="item.id"
            >{{ item.title }}</span
          >
        </div>
        <div class="right bx" v-if="ot2.length > 0">
          <span
            @click="
              this.$router.push({ name: 'service', query: { id: item.id } })
            "
            v-for="item in ot2"
            :key="item.id"
            >{{ item.title }}</span
          >
        </div>
      </div>
      <h2>Для граждан РФ:</h2>
      <div class="services ru">
        <div class="left bx" v-if="ru1.length > 0">
          <span
            @click="
              this.$router.push({ name: 'service', query: { id: item.id } })
            "
            v-for="item in ru1"
            :key="item.id"
            >{{ item.title }}</span
          >
        </div>
        <div class="right bx" v-if="ru2.length > 0">
          <span
            @click="
              this.$router.push({ name: 'service', query: { id: item.id } })
            "
            v-for="item in ru2"
            :key="item.id"
            >{{ item.title }}</span
          >
        </div>
      </div>
      <div class="wrap-btn">
        <button class="btn bx">Консультация по услугам</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  padding: 30px 40px;
  background-color: #35339b;
}

.wrap-info {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

h1 {
  color: #ffffff;
  font-size: 70px;
  line-height: 70px;
  font-weight: 400;
  text-align: center;
}

h2 {
  color: #ffffff;
  font-size: 42px;
  line-height: 42px;
  font-weight: 400;
}

.services {
  display: flex;
  align-items: stretch;
  gap: 10px;
}

.left,
.right {
  flex: 50%;
  background-color: #eaeaea;
  border-radius: 30px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

span {
  width: fit-content;
  color: #35339b;
  font-weight: 400;
  font-size: 25px;
  line-height: 25px;
}

.wrap-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn {
  border-radius: 20px;
  background-color: #bd2929;
  color: #fff;
  font-weight: 400;
  font-size: 25px;
  line-height: 25px;
  padding: 17px 24px;
}

span::after {
  margin-top: 2px;
  background-color: #35339b; /* Цвет линии при наведении на нее курсора мыши */
  display: block;
  content: "";
  height: 2px; /* Высота линии */
  width: 0%;
  -webkit-transition: width 0.3s ease-in-out;
  -moz--transition: width 0.3s ease-in-out;
  transition: width 0.3s ease-in-out;
}
span:hover:after,
span:focus:after {
  width: 100%;
}

@media (max-width: 800px) {
  h1 {
    font-size: 40px;
    line-height: 40px;
  }

  h2 {
    font-size: 20px;
    line-height: 20px;
  }

  span {
    font-size: 16px;
    line-height: 16px;
  }

  .left,
  .right {
    gap: 15px;
  }
}

@media (max-width: 650px) {
  .services {
    flex-direction: column;
  }

  .btn {
    font-size: 18px;
    line-height: 18px;
    padding: 12px 17px;
  }
}
</style>
