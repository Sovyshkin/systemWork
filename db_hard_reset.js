let { sequelize, UserModel, ServiceModel } = require("./modules/models");
const bcrypt = require("bcryptjs");

const load_info = async () => {
  await sequelize.drop();
  console.log("tables dropped, creating new ones...");

  await sequelize.sync({
    force: true,
  });
  console.log("tables synchronized.");

  let hashPassword = bcrypt.hashSync("admin123", 7);
  const newUser = await UserModel.create({
    username: "Admin",
    surname: "Adminov",
    login: "Admin",
    password: hashPassword,
  });

  await newUser.save();

  console.log("done.");

  let services_ru = [
    "Иное гражданство",
    "Визы в другие страны",
    "Переводы письменные и устные  с/на иностранных языков (нотариальное заверение)",
    "Сдача пенсионной отчётности",
    "Секретарские услуги",
    "Услуги фото",
    "Бухгалтерские услуги",
    "Сдача налоговой отчетности",
  ];

  let services = [
    "Миграционный и регистрационный учет в РФ",
    "Приглашение на въезд в РФ",
    "Уведомление о проживании в РФ",
    "Переселение соотечественников",
    "Разрешение на работу в РФ",
    "Уведомление по ТД и ГПХ",
    "Составление трудовых договоров",
    "Медицинское освидетельствование иностранных граждан",
    "Тестирование иностранных граждан на знание русского языка",
    "Бухгалтерское и миграционное ведение организаций под ключ для устройства на работу иностранных граждан",
    "Вид на жительство в РФ",
    "Виза в РФ",
    "Гражданство РФ",
    "Трудовой патент РФ",
    "Получение инн, снилс",
    "Переводы с иностранных языков (нотариальное заверение)",
    "Разрешение на временное проживание в РФ",
    "Секретарские услуги",
    "Услуги фото",
    "Бухгалтерские услуги",
    "Сдача налоговой отчетности",
    "Сдача пенсионной отчётности",
  ];

  for (let i = 0; i < services_ru.length; i++) {
    let service = await ServiceModel.create({
      title: services_ru[i],
      ru: true,
    });
    await service.save();
  }

  for (let i = 0; i < services.length; i++) {
    let service = await ServiceModel.create({
      title: services[i],
      ru: false,
    });
    await service.save();
  }
};

load_info();
