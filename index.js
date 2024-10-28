// библиотеки
const express = require(`express`);
const session = require("express-session");
const fileUpload = require("express-fileupload");

const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mkdirp = require("mkdirp");

const dayjs = require("dayjs");

const path = require("path");

// модули самого бэкенда
const {
  sequelize,
  UserModel,
  ObjectModel,
  WorkModel,
  CategoryModel,
  SubcategoryModel,
  VacancyModel,
  MarkModel,
} = require("./modules/models");
const { secret } = require(`./config`);
const { isBooleanObject } = require("util/types");
const { parentPort } = require("worker_threads");

let app = express();
let port = process.env.PORT || 3000;

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
app.use("/assets", express.static("./public/assets"));
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
    let { name, surname, phone } = req.body;

    let user = await UserModel.findOne({ where: { name, surname, phone } });
    if (!user) {
      res.send({
        message: `Пользователь не найден`,
        status: 400,
      });
    } else {
      res.send({
        message: "Успешно",
        status: 200,
        id: user.id,
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/users/create`, async function (req, res) {
  try {
    let { name, surname, phone, role } = req.body;
    if (!role) {
      let user = await UserModel.create({
        name,
        surname,
        phone,
        accrued: 0,
        paid: 0,
        total: 0,
        role: "Сотрудник",
      });
      user.save();
      res.send({ message: "Успешно" });
    } else if (role == "Проверяющий") {
      let user = await UserModel.create({
        name,
        surname,
        phone,
        accrued: 0,
        paid: 0,
        total: 0,
        role,
      });
      user.save();
      res.send({ message: "Успешно" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/users/get`, async function (req, res) {
  try {
    let { id } = req.body;
    let user = await UserModel.findOne({ where: { id } });
    if (user) {
      res.send({ user });
    } else {
      res.send({ message: "Пользователь не найден" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/users/delete`, async function (req, res) {
  try {
    let { id } = req.body;
    let user = await UserModel.findOne({ where: { id } });
    if (user) {
      user.destroy();
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Пользователь не найден" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/users/edit`, async function (req, res) {
  try {
    let { id, name, surname, phone } = req.body;
    let user = await UserModel.findOne({ where: { id } });
    if (user) {
      user.name = name;
      user.surname = surname;
      user.phone = phone;
      user.save();
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Пользователь не найден" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/users/get/all`, async function (req, res) {
  try {
    let { role } = req.body;
    if (role == "Проверяющий") {
      let inspectors = await UserModel.findAll({
        where: { role: "Проверяющий" },
      });
      res.send({ inspectors });
    } else {
      let users = await UserModel.findAll({ where: { role: "Сотрудник" } });
      let accrued = 0;
      let paid = 0;
      let total = 0;
      users.forEach((user) => {
        accrued += user.accrued;
        paid += user.paid;
        total += user.total;
      });
      res.send({ users, accrued, paid, total });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/users/check_verify`, async function (req, res) {
  try {
    let { id } = req.body;
    if (id) {
      let user = await UserModel.findOne({ where: { id } });
      if (user) {
        res.send({ message: "ok", role: user.role });
      } else {
        res.send({ message: "not found" });
      }
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/users/pay/total`, async function (req, res) {
  try {
    let { id } = req.body;
    if (id) {
      let user = await UserModel.findOne({ where: { id } });
      if (user) {
        user.total += user.paid;
        user.paid = 0;
        user.save();
        res.send({ message: "Успешно" });
      } else {
        res.send({ message: "not found" });
      }
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/objects/get`, async function (req, res) {
  try {
    let { id } = req.body;
    if (id) {
      let object = await ObjectModel.findOne({ where: { id } });
      if (object) {
        res.send({ object });
      } else {
        res.send({ message: "Такого объекта не существует" });
      }
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/objects/get/all`, async function (req, res) {
  try {
    let objects = await ObjectModel.findAll({ where: { done: false } });
    res.send({ objects });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/objects/create`, async function (req, res) {
  try {
    let { title, desc } = req.body;
    let object = await ObjectModel.create({
      title,
      desc,
      done: false,
      completed: 0,
    });
    object.save();
    res.send({ message: "Успешно" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/objects/edit`, async function (req, res) {
  try {
    let { id, title, desc } = req.body;
    let object = await ObjectModel.findOne({ where: { id } });
    object.title = title;
    object.desc = desc;
    object.save();
    res.send({ message: "Успешно" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/objects/done`, async function (req, res) {
  try {
    let { id } = req.body;
    let object = await ObjectModel.findOne({ where: { id } });
    object.done = true;
    object.save();
    res.send({ message: "Успешно" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/works/get`, async function (req, res) {
  try {
    let { id } = req.body;
    let work = await WorkModel.findOne({ where: { id } });
    if (work) {
      let categories = [];
      if (work.level) {
        categories = await CategoryModel.findAll({
          where: { work_id: id, done: false },
        });
      }
      res.send({ work, categories });
    } else {
      res.send({ message: "Ничего не найдено" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/works/get/all`, async function (req, res) {
  try {
    let { object_id } = req.body;
    let works = await WorkModel.findAll({ where: { object_id } });
    res.send({ works });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/works/create`, async function (req, res) {
  try {
    let { object_id, title } = req.body;
    if (object_id && title) {
      let work = await WorkModel.create({
        object_id: object_id,
        title: title,
        completed: 0,
        active_states: [],
        state: [],
        accrued: 0,
        paid: 0,
        totat: 0,
        hours: 0,
        piece: 0,
        done: false,
        show: true,
      });
      work.save();
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Не все данные переданы" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/works/edit`, async function (req, res) {
  try {
    let { id, title, desc, level } = req.body;
    let work = await WorkModel.findOne({ where: { id } });
    if (work) {
      work.title = title;
      work.desc = desc;
      work.level = level;
      work.save();
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Такой работы не существует" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/works/delete`, async function (req, res) {
  try {
    let { id } = req.body;
    let work = await WorkModel.findOne({ where: { id } });
    if (work) {
      work.show = false;
      work.save();
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Такой работы не существует" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/works/done`, async function (req, res) {
  try {
    let { id } = req.body;
    let work = await WorkModel.findOne({ where: { id } });
    work.done = true;
    work.save();
    res.send({ message: "Успешно" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/categories/add`, async function (req, res) {
  try {
    let { work_id, title } = req.body;
    if (work_id && title) {
      let category = await CategoryModel.create({
        title: title,
        work_id: work_id,
        hours: 0,
        count: 0,
        count_completed: 0,
        hours_completed: 0,
        done: false,
        level: false,
      });
      category.save();
      res.send({ message: "Успешно" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/categories/get`, async function (req, res) {
  try {
    let { id } = req.body;
    let category = await CategoryModel.findOne({ where: { id } });
    if (category) {
      let work_id = category.work_id;
      let work = await WorkModel.findOne({ where: { id: work_id } });
      res.send({ category, title: work.title });
    } else {
      res.send({ message: "Такой категории не существует" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/categories/get/all`, async function (req, res) {
  try {
    let { work_id } = req.body;
    let categories = await CategoryModel.findAll({
      where: { work_id, done: false },
    });
    res.send({ categories });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/categories/done`, async function (req, res) {
  try {
    let { id } = req.body;
    let category = await CategoryModel.findOne({ where: { id } });
    category.done = true;
    category.save();
    res.send({ message: "Успешно" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/categories/edit`, async function (req, res) {
  try {
    let { id, title, desc, level, count, hours } = req.body;
    let category = await CategoryModel.findOne({ where: { id } });
    if (category) {
      category.title = title;
      category.desc = desc;
      category.level = level;
      category.hours = hours;
      category.count = count;
      category.save();
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Такой категории не существует" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/subcategories/add`, async function (req, res) {
  try {
    let { category_id, title } = req.body;
    if (category_id && title) {
      let subcategory = await SubcategoryModel.create({
        title: title,
        category_id: category_id,
        hours: 0,
        count: 0,
        count_completed: 0,
        hours_completed: 0,
        done: false,
      });
      subcategory.save();
      res.send({ message: "Успешно" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/subcategories/edit`, async function (req, res) {
  try {
    let { id, title, desc, count, hours } = req.body;
    let subcategory = await SubcategoryModel.findOne({ where: { id } });
    if (subcategory) {
      subcategory.title = title;
      subcategory.desc = desc;
      subcategory.hours = hours;
      subcategory.count = count;
      subcategory.save();
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Такой категории не существует" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/subcategories/get`, async function (req, res) {
  try {
    let { id } = req.body;
    let subcategory = await SubcategoryModel.findOne({ where: { id } });
    if (subcategory) {
      let category_id = subcategory.category_id;
      let category = await CategoryModel.findOne({
        where: { id: category_id },
      });
      let work_id = category.work_id;
      let work = await WorkModel.findOne({
        where: { id: work_id },
      });
      res.send({ title: work.title, subcategory });
    } else {
      res.send({ message: "Такой категории не существует" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/subcategories/get/all`, async function (req, res) {
  try {
    let { category_id } = req.body;
    let subcategories = await SubcategoryModel.findAll({
      where: { category_id, done: false },
    });
    res.send({ subcategories });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/subcategories/done`, async function (req, res) {
  try {
    let { id } = req.body;
    let subcategory = await SubcategoryModel.findOne({ where: { id } });
    subcategory.done = true;
    subcategory.save();
    res.send({ message: "Успешно" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/get`, async function (req, res) {
  try {
    let { id } = req.body;
    let vacancy = await VacancyModel.findOne({ where: { id } });
    if (vacancy) {
      res.send({ vacancy });
    } else {
      res.send({ message: "Такой вакансии не существует" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/active`, async function (req, res) {
  try {
    let { userID } = req.body;
    let vacancies = await VacancyModel.findAll({
      where: { executor: userID, done: false },
    });
    res.send({ vacancies });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/get/all`, async function (req, res) {
  try {
    let { category_id, subcategory_id, archive, userID } = req.body;
    let vacancies = [];
    if (!archive) {
      if (category_id) {
        vacancies = await VacancyModel.findAll({
          where: { category_id, done: false },
        });
      } else if (subcategory_id) {
        vacancies = await VacancyModel.findAll({
          where: { subcategory_id, done: false },
        });
      }
    } else {
      vacancies = await VacancyModel.findAll({
        where: { done: true, executor: userID },
      });
    }
    res.send({ vacancies });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/add`, async function (req, res) {
  try {
    let { category_id, subcategory_id, title } = req.body;
    if (category_id) {
      if (title) {
        let category = await CategoryModel.findOne({
          where: { id: category_id },
        });
        let work = await WorkModel.findOne({ where: { id: category.work_id } });
        let object = await ObjectModel.findOne({
          where: { id: work.object_id },
        });
        let vacancy = await VacancyModel.create({
          category_id,
          title,
          object_title: object.title,
          price: 0,
          condition: "час",
          done: false,
          check: false,
        });
        vacancy.save();
        res.send({ message: "Успешно" });
      }
    } else if (subcategory_id) {
      if (title) {
        let subcategory = await SubcategoryModel.findOne({
          where: { id: subcategory_id },
        });
        let category = await CategoryModel.findOne({
          where: { id: subcategory.category_id },
        });
        let work = await WorkModel.findOne({ where: { id: category.work_id } });
        let object = await ObjectModel.findOne({
          where: { id: work.object_id },
        });
        let vacancy = await VacancyModel.create({
          subcategory_id,
          title,
          object_title: object.title,
          price: 0,
          condition: "час",
          done: false,
          check: false,
        });
        vacancy.save();
        res.send({ message: "Успешно" });
      }
    } else {
      console.log("Не передан ID родителя");
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/edit`, async function (req, res) {
  try {
    let { id, title, desc, price, condition } = req.body;
    let vacancy = await VacancyModel.findOne({ where: { id } });
    if (vacancy) {
      vacancy.title = title;
      vacancy.desc = desc;
      vacancy.price = price;
      vacancy.condition = condition;
      vacancy.save();
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Такой вакансии не существует" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/accept`, async function (req, res) {
  try {
    let { id, userID } = req.body;
    let vacancy = await VacancyModel.findOne({ where: { id } });
    let user = await UserModel.findOne({ where: { id: userID } });
    if (vacancy) {
      vacancy.executor = userID;
      vacancy.executorName = user.name;
      vacancy.executorSurname = user.surname;
      vacancy.save();
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Такой вакансии не существует" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/refuse`, async function (req, res) {
  try {
    let { id } = req.body;
    let vacancy = await VacancyModel.findOne({ where: { id } });
    if (vacancy) {
      vacancy.executor = "";
      vacancy.executorName = "";
      vacancy.executorSurname = "";
      vacancy.save();
      res.send({ message: "Успешно" });
    } else {
      res.send({ message: "Такой вакансии не существует" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/finish`, async function (req, res) {
  try {
    let { id, userID, count, comment } = req.body;
    let user = await UserModel.findOne({ where: { id: userID } });
    let vacancy = await VacancyModel.findOne({ where: { id } });
    user.accrued = user.accrued + vacancy.price * count;
    user.save();
    vacancy.check = true;
    vacancy.done = true;
    vacancy.count = count;
    vacancy.comment = comment;
    vacancy.save();
    let date = dayjs().format("DD.MM.YYYY");
    let mark = await MarkModel.create({
      userID: userID,
      name: user.name,
      surname: user.surname,
      count: count,
      date: date,
    });
    mark.save();
    if (vacancy.subcategory_id) {
      let subcategory = await SubcategoryModel.findOne({
        where: { id: vacancy.subcategory_id },
      });
      subcategory.accrued = subcategory.accrued + vacancy.price * count;
      subcategory.save();
      let category = await CategoryModel.findOne({
        where: { id: subcategory.category_id },
      });
      category.accrued = category.accrued + vacancy.price * count;
      category.save();
      let work = await WorkModel.findOne({ where: { id: category.work_id } });
      work.accrued = work.accrued + vacancy.price * count;
      work.save();
      let object = await ObjectModel.findOne({ where: { id: work.object_id } });
      object.accrued = object.accrued + vacancy.price * count;
      object.save();
    } else if (vacancy.category_id) {
      let category = await CategoryModel.findOne({
        where: { id: vacancy.category_id },
      });
      category.accrued = category.accrued + vacancy.price * count;
      category.save();
      console.log(category);
      let work = await WorkModel.findOne({ where: { id: category.work_id } });
      work.accrued = work.accrued + vacancy.price * count;
      work.save();
      let object = await ObjectModel.findOne({ where: { id: work.object_id } });
      object.accrued = object.accrued + vacancy.price * count;
      object.save();
    }
    res.send({ message: "Успешно" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/check/get/all`, async function (req, res) {
  try {
    let { id } = req.body;
    let vacancies = await VacancyModel.findAll({
      where: { executor: id, check: true },
    });
    res.send({ vacancies });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/pay/accrued`, async function (req, res) {
  try {
    let { id, amount } = req.body;
    let vacancy = await VacancyModel.findOne({ where: { id } });
    vacancy.accrued -= amount;
    vacancy.paid += amount;
    vacancy.check = false;
    vacancy.done = true;
    vacancy.save();
    let user = await UserModel.findOne({ where: { id: vacancy.executor } });
    user.accrued -= amount;
    user.paid += amount;
    user.save();
    if (vacancy.subcategory_id) {
      let subcategory = await SubcategoryModel.findOne({
        where: { id: vacancy.subcategory_id },
      });
      subcategory.accrued -= amount;
      subcategory.paid += amount;
      if (vacancy.condition == "шт") {
        subcategory.count_completed += vacancy.count;
      } else if (vacancy.condition == "час") {
        subcategory.hours_completed += vacancy.count;
      }
      subcategory.save();
      let category = await CategoryModel.findOne({
        where: { id: subcategory.category_id },
      });
      category.accrued -= amount;
      category.paid += amount;

      let subcategories = await SubcategoryModel.findAll({
        where: { category_id: category.id },
      });
      let numerator = 0;
      let denominator = 0;
      subcategories.forEach((item) => {
        numerator += item.hours_completed + item.count_completed;
        denominator += item.hours + item.count;
      });
      if (denominator != 0) {
        category.completed = (numerator / denominator) * 100;
      } else {
        category.completed = 0;
      }

      category.save();
      let work = await WorkModel.findOne({ where: { id: category.work_id } });
      work.accrued -= amount;
      work.paid += amount;

      numerator = 0;
      denominator = 0;
      let categories = await CategoryModel.findAll({
        where: { work_id: work.id },
      });
      categories.forEach((item) => {
        numerator += item.completed;
      });
      denominator = categories.length;
      if (denominator != 0) {
        work.completed = numerator / denominator;
      } else {
        work.completed = 0;
      }

      work.save();

      let object = await ObjectModel.findOne({ where: { id: work.object_id } });
      object.accrued -= amount;
      object.paid += amount;

      numerator = 0;
      denominator = 0;
      let works = await WorkModel.findAll({
        where: { object_id: object.id },
      });
      works.forEach((item) => {
        numerator += item.completed;
      });
      denominator = works.length;
      if (denominator != 0) {
        object.completed = numerator / denominator;
      } else {
        object.completed = 0;
      }

      object.save();
    } else if (vacancy.category_id) {
      let category = await CategoryModel.findOne({
        where: { id: vacancy.category_id },
      });
      category.accrued -= amount;
      category.paid += amount;
      if (vacancy.condition == "шт") {
        category.count_completed += vacancy.count;
      } else if (vacancy.condition == "час") {
        category.hours_completed += vacancy.count;
      }

      if (category.count + category.hours) {
        category.completed =
          ((category.count_completed + category.hours_completed) /
            (category.count + category.hours)) *
          100;
      } else {
        category.completed = 0;
      }

      category.save();
      console.log(category);
      let work = await WorkModel.findOne({ where: { id: category.work_id } });
      work.accrued -= amount;
      work.paid += amount;

      numerator = 0;
      denominator = 0;
      let categories = await CategoryModel.findAll({
        where: { work_id: work.id },
      });
      categories.forEach((item) => {
        numerator += item.completed;
      });
      denominator = categories.length;
      if (denominator != 0) {
        work.completed = numerator / denominator;
      } else {
        work.completed = 0;
      }

      work.save();
      let object = await ObjectModel.findOne({ where: { id: work.object_id } });
      object.accrued -= amount;
      object.paid += amount;

      numerator = 0;
      denominator = 0;
      let works = await WorkModel.findAll({
        where: { object_id: object.id },
      });
      works.forEach((item) => {
        numerator += item.completed;
      });
      denominator = works.length;
      if (denominator != 0) {
        object.completed = numerator / denominator;
      } else {
        object.completed = 0;
      }

      object.save();
    }
    res.send({ message: "Успешно" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/vacancies/done`, async function (req, res) {
  try {
    let { id } = req.body;
    let vacancy = await VacancyModel.findOne({ where: { id } });
    vacancy.done = true;
    vacancy.save();
    res.send({ message: "Успешно" });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});

app.post(`/marks/get/all`, async function (req, res) {
  try {
    let { userID } = req.body;
    let marks = await MarkModel.findAll({ where: { userID } });
    res.send({ marks });
  } catch (err) {
    console.log(err);
    res.send({ message: "Произошла ошибка на стороне сервера" });
  }
});
