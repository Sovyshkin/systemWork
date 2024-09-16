// библиотеки
const express = require(`express`);
const session = require("express-session");
const fileUpload = require("express-fileupload");

const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mkdirp = require("mkdirp");

const path = require("path");

// модули самого бэкенда
const { sequelize, UserModel, ServiceModel } = require("../modules/models");
const { secret } = require(`../config`);
const { isBooleanObject } = require("util/types");

let app = express();
let port = process.env.PORT || 3015;

app.listen(port, function () {
  console.log(`http://localhost:${port}`);
});

app.use(cors());

// Подключаем middleware для сессий
app.use(
  session({ secret: "secret-key", resave: false, saveUninitialized: true })
);
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Раздача статики
app.use("/assets", express.static("../public/assets"));
// Настройка POST-запроса — JSON
app.use(express.json());
app.use(fileUpload());
// Настройка POST-запроса
app.use(express.urlencoded({ extended: true }));

// фикс вылета на перезагрузке
app.route("/*").get(function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
app.get("/", async function (req, res) {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.post(`/login`, async function (req, res) {
  try {
    let { login, password } = req.body;

    let user = await UserModel.findOne({ where: { login } });
    if (!user) {
      res.send({
        message: `Пользователь не найден`,
        status: 400,
      });
    } else {
      let validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        res.send({ message: "Введен неверный пароль", status: 400 });
      }
      res.send({
        message: "Успешно",
        status: 200,
        id: user.id,
        token: user.password,
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Login error", status: 400 });
  }
});

app.post(`/create_service`, async function (req, res) {
  try {
    let { title, desc, ru } = req.body;
    try {
      console.log("building card...");
      let card = await ServiceModel.build({
        img: {},
        title: title,
        desc: desc,
        ru: ru,
      });
      console.log("saving card...");
      try {
        card.save().then((e) => {
          try {
            console.log("binding id...");
            timeId = card.id;
          } catch (e) {
            console.log(`Ошибка создания timeId: ${e} `);
            return res.send({
              message: `Ошибка создания timeId: ${e} `,
              status: "400",
            });
          }

          console.log("done.");
          return res.send({
            //message: `Создание карты завершено, timeId: ${timeId}`,
            message: timeId,
            error: "Запрос успешно добавлен",
            status: "200",
            success: true,
          });
        });
      } catch (e) {
        console.log(`сохранение не работает: ${e} `);
        return res.send({
          message: `сохранение не работает: ${e} `,
          status: "400",
        });
      }
    } catch (e) {
      console.log(`Ошибка создания карточки: ${e} `);
      return res.send({
        message: `Ошибка создания карточки: ${e} `,
        status: "400",
      });
    }
  } catch (err) {
    res.send({
      message: "Ошибка создания услуги",
      err,
    });
  }
});

app.post(`/edit_service`, async function (req, res) {
  try {
    let { title, desc, id, ru } = req.body;
    try {
      let card = await ServiceModel.findOne({ where: { id } });
      card.title = title;
      card.desc = desc;
      card.ru = ru;
      console.log("saving card...");
      try {
        card.save().then((e) => {
          try {
            console.log("binding id...");
            timeId = card.id;
          } catch (e) {
            console.log(`Ошибка создания timeId: ${e} `);
            return res.send({
              message: `Ошибка создания timeId: ${e} `,
              status: "400",
            });
          }

          console.log("done.");
          return res.send({
            //message: `Создание карты завершено, timeId: ${timeId}`,
            message: timeId,
            error: "Запрос успешно добавлен",
            status: "200",
            success: true,
          });
        });
      } catch (e) {
        console.log(`сохранение не работает: ${e} `);
        return res.send({
          message: `сохранение не работает: ${e} `,
          status: "400",
        });
      }
    } catch (e) {
      console.log(`Ошибка создания карточки: ${e} `);
      return res.send({
        message: `Ошибка создания карточки: ${e} `,
        status: "400",
      });
    }
  } catch (err) {
    res.send({
      message: "Ошибка создания услуги",
      err,
    });
  }
});

app.post(`/upload_one`, async function (req, res) {
  try {
    let { id } = req.query;
    if (req.files) {
      let file = req.files.files;
      let imgName = [];
      let date = new Date();
      let time = date.getTime();
      let filename = `img_${time}.jpg`;
      imgName.push(filename);

      let mediaPath = path.join(__dirname, `public/assets/`);
      let imgPath = path.join(mediaPath, filename);

      // Создание директории, если она не существует
      if (!fs.existsSync(mediaPath)) {
        await mkdirp(mediaPath);
      }
      // Запись файла
      await new Promise((resolve, reject) => {
        file.mv(imgPath, function (err) {
          if (err) {
            console.log("ERROR OCCURED WHEN SAVING FILE:", err);
            reject(err);
          } else {
            console.log("Saved!");
            resolve();
          }
        });
      });
      let service = await ServiceModel.findOne({ where: { id: id } });
      service.img = imgName;
      await service.save();
      return res.send({ message: "Успешно" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/verify_token`, async function (req, res) {
  try {
    let { token } = req.body;
    let user = await UserModel.findOne({ where: { password: token } });
    if (user) {
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Неправильный токен" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post(`/get_services`, async function (req, res) {
  try {
    let { ru } = req.body;
    let services;
    if (Boolean(ru)) {
      services = await ServiceModel.findAll({ where: { ru } });
    } else {
      services = await ServiceModel.findAll();
    }
    res.send({ services });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/get_service`, async function (req, res) {
  try {
    let { id } = req.body;
    let service = await ServiceModel.findOne({ where: { id } });
    res.send({
      title: service.title,
      desc: service.desc,
      img: service.img,
      ru: service.ru,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post(`/delete_service`, async function (req, res) {
  try {
    let { id } = req.body;
    let service = await ServiceModel.findOne({ where: { id } });
    await service.destroy();
    res.send({ message: "Услуга удалена" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Ошибка на стороне сервера" });
  }
});

app.post(`/delete_image`, async function (req, res) {
  try {
    let { id } = req.body;
    let service = await ServiceModel.findOne({ where: { id } });
    service.img = "";
    await service.save();
    res.send({ message: "Изображение удалено" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Ошибка на стороне сервера" });
  }
});
