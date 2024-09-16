<script>
/* eslint-disable */
export default {
  data() {
    return {};
  },
  methods: {
    async renderMap() {
      ymaps.ready(init); // когда апи готово, инициализируемя карту
      var customMap; // объявим переменную для карты
      async function init() {
        // функция инициализации
        customMap = new ymaps.Map("customMap", {
          // создадим карту выведем ее в див с id="customMap"
          center: [51.764058, 55.115281], // центра карты
          behaviors: ["default", "scrollZoom"], // скроллинг колесом
          zoom: 17, // масштаб карты
          controls: ["zoomControl", "fullscreenControl"], // элементы управления
        });

        customMap.controls.remove("geolocationControl"); // удаляем геолокацию
        customMap.controls.remove("searchControl"); // удаляем поиск
        customMap.controls.remove("trafficControl"); // удаляем контроль трафика
        customMap.controls.remove("typeSelector"); // удаляем тип
        customMap.controls.remove("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
        customMap.controls.remove("zoomControl"); // удаляем контрол зуммирования
        customMap.controls.remove("rulerControl"); // удаляем контрол правил
        let branches = [
          {
            city: "Оренбург",
            street: "Ленинская ул. 60",
            coords: [51.764058, 55.115281],
          },
          {
            city: "Оренбург",
            street: "Степана Разина, 204, 1 этаж",
            coords: [51.781339, 55.109891],
          },
          {
            city: "Оренбург",
            street: "16-я линия, 12",
            coords: [51.786989, 55.176384],
          },
          {
            city: "Оренбург",
            street: "Максима Горького, 8 ​цокольный этаж",
            coords: [51.755986, 55.095859],
          },
        ];
        for (let i = 0; i < branches.length; i++) {
          const placemark = new ymaps.Placemark(
            branches[i].coords,
            {},
            {
              iconLayout: "default#image",
              iconImageHref: "../assets/metka.png", // путь к стандартному изображению
              iconImageSize: [32, 32],
              iconImageOffset: [-16, -16],
            }
          );

          customMap.geoObjects.add(placemark);
        }
      }
    },
  },
  mounted() {
    this.renderMap();
  },
};
</script>

<template>
  <div id="customMap" class="map"></div>
</template>

<style scoped>
.map {
  width: 100%;
  height: 370px;
}
</style>
