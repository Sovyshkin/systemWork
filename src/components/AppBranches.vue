<script>
import AppMap from "../components/AppMap.vue";
export default {
  name: "AppBranches",
  components: { AppMap },
  data() {
    return {
      branches: [
        {
          street: "Ленинская ул. 60",
          coords: [51.764058, 55.115281],
        },
        {
          street: "Степана Разина, 204, 1 этаж",
          coords: [51.781339, 55.109891],
        },
        {
          street: "16-я линия, 12",
          coords: [51.786989, 55.176384],
        },
        {
          street: "Максима Горького, 8 ​цокольный этаж",
          coords: [51.755986, 55.095859],
        },
      ],
    };
  },
  methods: {},
  mounted() {},
};
</script>

<template>
  <div class="wrapper">
    <h1>Филиалы</h1>
    <div class="info">
      <div class="branches">
        <div class="city">Оренбург:</div>
        <div class="branch" v-for="item in branches" :key="item.city">
          <img src="../assets/redCircle.png" alt="" />
          <span class="street">{{ item.street }}</span>
        </div>
      </div>
      <div class="wrap-map">
        <AppMap />
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  padding: 10px 40px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

h1 {
  color: #35339b;
  font-size: 62px;
  line-height: 62px;
  font-weight: 400;
}

.city {
  color: #bd2929;
  font-weight: 400;
  font-size: 46px;
  line-height: 46px;
}

.street {
  color: #bd2929;
  font-size: 28px;
  line-height: 28px;
  font-weight: 400;
}

.info {
  display: flex;
  gap: 10px;
}

.branches {
  flex: 50%;
  padding-left: 20px;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.branch {
  display: flex;
  align-items: center;
  gap: 10px;
}

.wrap-map {
  flex: 50%;
  border-radius: 30px;
  border: 10px solid #bd2929;
  overflow: hidden;
}

@media (max-width: 800px) {
  h1 {
    font-size: 40px;
    line-height: 40px;
  }

  .city {
    font-size: 25px;
    line-height: 25px;
  }

  .street {
    font-size: 20px;
    line-height: 20px;
  }

  .info {
    flex-direction: column-reverse;
  }

  .branches {
    gap: 10px;
  }
}
</style>
