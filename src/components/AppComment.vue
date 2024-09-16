<script>
export default {
  name: "AppComment",
  components: {},
  data() {
    return {
      comments: [
        {
          name: "Юлия",
          text: "Очень грамотные специалисты, всё подробно объясняют, помогают разобраться в документах, подскажут какие нужно перевод делать. Переводы готовятся быстро и грамотно. Хочу высказать огромную благодарность за помощь.",
        },
        {
          name: "Наталья",
          text: "Очень хороший офис! Всё делается быстро, хороший персонал, объясняют понятно. Директор этой компании просто молодец!!! Мы остались довольны. Спасибо вам! Обязательно обратимся к вам ещё.",
        },
        {
          name: "Сергей",
          text: "Простое, хорошее, человеческое отношение. На мой взгляд. Особенно могу отметить фотоуслуги. На уровне достойно.",
        },
        {
          name: "Румиль",
          text: "Намного проще и быстрее, а также дешевле чем в других местах.",
        },
        {
          name: "Светлана",
          text: "Делала перевод документов, приняли быстро, через три часа всё было готово. Быстро, качественно, спасибо.",
        },
        {
          name: "Катерина",
          text: "Работа была выполнена качественно и быстро!",
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
    <h1>Что говорят клиенты</h1>
    <div class="wrap-comments">
      <div class="comment bx" v-for="item in comments" :key="item.name">
        <div class="name">{{ item.name }}</div>
        <p>{{ item.text }}</p>
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
  text-align: center;
}

.wrap-comments {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: stretch;
}

.comment {
  flex: 30%;
  background-color: #35339b;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.name {
  font-size: 33px;
  line-height: 33px;
  color: #fff;
  font-weight: 400;
}

p {
  font-size: 20px;
  line-height: 20px;
  color: #fff;
  font-weight: 400;
}

@media (max-width: 800px) {
  h1 {
    font-size: 40px;
    line-height: 40px;
  }

  .name {
    font-size: 25px;
    line-height: 20px;
  }

  p {
    font-size: 16px;
    line-height: 16px;
  }

  .left,
  .right {
    gap: 15px;
  }

  .comment {
    padding: 10px;
  }
}

@media (max-width: 490px) {
  .wrap-comments {
    flex-direction: column;
  }
}
</style>
