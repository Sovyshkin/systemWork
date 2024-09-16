<script>
export default {
  name: "AboutUs",
  components: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>

<template>
  <div class="wrapper">
    <div class="left bx">
      <h1 class="title">
        Содействие в получении государственных услуг в сфере миграции
      </h1>
      <ul class="group-list">
        <li class="item-group">
          <img src="../assets/circle.png" alt="" />
          <p>Грамотная консультация</p>
        </li>
        <li class="item-group">
          <img src="../assets/circle.png" alt="" />
          <p>Гарантия по договору</p>
        </li>
        <li class="item-group">
          <img src="../assets/circle.png" alt="" />
          <p>Контроль и сопровождение каждого этапа подачи документов</p>
        </li>
        <li class="item-group">
          <img src="../assets/circle.png" alt="" />
          <p>Проверка документов на ошибки и расхождения</p>
        </li>
      </ul>
      <div class="wrap-btns">
        <button class="btn bx">Услуги</button>
        <button class="btn btn-right bx">Консультация</button>
      </div>
    </div>
    <div class="right bx">
      <img src="../assets/contact.png" alt="" />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  margin-top: 100px;
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 10px;
  padding: 0 40px;
}

.left,
.right {
  width: 50%;
  border-radius: 30px;
  height: 550px;
}

.right img {
  width: 100%;
  border-radius: 30px;
  max-height: 550px;
}

.left {
  background-color: #35339b;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
}

h1 {
  color: #ffffff;
  font-size: 44px;
  line-height: 44px;
  font-weight: 400;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-group p {
  color: #ffffff;
  font-size: 23px;
  line-height: 23px;
  font-weight: 400;
}

.wrap-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.btn {
  flex: 50%;
  background-color: transparent;
  border: 3px solid #bd2929;
  border-radius: 20px;
  color: #ffffff;
  font-size: 25px;
  line-height: 25px;
  font-weight: 400;
  padding: 17px 24px;
}

.btn-right {
  background-color: #bd2929;
  color: #fff;
}

@media (max-width: 1250px) {
  .left {
    padding: 20px;
    gap: 15px;
  }

  h1 {
    font-size: 37px;
    line-height: 37px;
  }
}

@media (max-width: 1000px) {
  .wrapper {
    flex-direction: column;
  }

  .left,
  .right {
    width: 100%;
    height: 400px;
  }

  .right img {
    width: 100%;
    height: 100%;
  }

  .btn {
    font-size: 20px;
    padding: 12px 17px;
  }
}

@media (max-width: 754px) {
  .group-list {
    gap: 8px;
  }

  .item-group p {
    font-size: 18px;
    line-height: 18px;
  }
  h1 {
    font-size: 31px;
    line-height: 32px;
  }
}

@media (max-width: 470px) {
  h1 {
    font-size: 27px;
    line-height: 27px;
  }

  .item-group p {
    font-size: 16px;
    line-height: 16px;
  }
  .btn {
    font-size: 16px;
    padding: 8px 14px;
  }
}

@media (max-width: 400px) {
  .left,
  .right {
    height: auto;
  }
  .wrap-btns {
    flex-direction: column;
    gap: 8px;
  }

  .btn {
    flex: 100%;
    width: 100%;
  }
}
</style>
