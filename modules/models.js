// здесь лежат все модели
const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
  logging: false,
});

class UserModel extends Model {}
UserModel.init(
  {
    name: { type: DataTypes.STRING, allowNull: true },
    surname: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    accrued: { type: DataTypes.INTEGER, allowNull: true },
    paid: { type: DataTypes.INTEGER, allowNull: true },
    total: { type: DataTypes.INTEGER, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "UserModel" }
);

class ObjectModel extends Model {}
ObjectModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: true },
    desc: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    accrued: { type: DataTypes.INTEGER, allowNull: true },
    paid: { type: DataTypes.INTEGER, allowNull: true },
    total: { type: DataTypes.INTEGER, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
    show: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "ObjectModel" }
);

class WorkModel extends Model {}
WorkModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: true },
    desc: { type: DataTypes.STRING, allowNull: true },
    completed: { type: DataTypes.INTEGER, allowNull: true },
    active_states: { type: DataTypes.JSON, allowNull: true },
    states: { type: DataTypes.JSON, allowNull: true },
    accrued: { type: DataTypes.INTEGER, allowNull: true },
    paid: { type: DataTypes.INTEGER, allowNull: true },
    total: { type: DataTypes.INTEGER, allowNull: true },
    hours: { type: DataTypes.INTEGER, allowNull: true },
    piece: { type: DataTypes.INTEGER, allowNull: true },
    object_id: { type: DataTypes.STRING, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
    show: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "WorkModel" }
);

class CategoryModel extends Model {}
CategoryModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: true },
    desc: { type: DataTypes.STRING, allowNull: true },
    active_states: { type: DataTypes.JSON, allowNull: true },
    states: { type: DataTypes.JSON, allowNull: true },
    accrued: { type: DataTypes.INTEGER, allowNull: true },
    paid: { type: DataTypes.INTEGER, allowNull: true },
    total: { type: DataTypes.INTEGER, allowNull: true },
    hours: { type: DataTypes.INTEGER, allowNull: true },
    count: { type: DataTypes.INTEGER, allowNull: true },
    hours_completed: { type: DataTypes.INTEGER, allowNull: true },
    count_completed: { type: DataTypes.INTEGER, allowNull: true },
    work_id: { type: DataTypes.STRING, allowNull: true },
    level: { type: DataTypes.BOOLEAN, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
    show: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "CategoryModel" }
);

class SubcategoryModel extends Model {}
SubcategoryModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: true },
    desc: { type: DataTypes.STRING, allowNull: true },
    active_states: { type: DataTypes.JSON, allowNull: true },
    states: { type: DataTypes.JSON, allowNull: true },
    accrued: { type: DataTypes.INTEGER, allowNull: true },
    paid: { type: DataTypes.INTEGER, allowNull: true },
    total: { type: DataTypes.INTEGER, allowNull: true },
    hours: { type: DataTypes.INTEGER, allowNull: true },
    count: { type: DataTypes.INTEGER, allowNull: true },
    hours_completed: { type: DataTypes.INTEGER, allowNull: true },
    count_completed: { type: DataTypes.INTEGER, allowNull: true },
    category_id: { type: DataTypes.STRING, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
    show: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "SubcategoryModel" }
);

class VacancyModel extends Model {}
VacancyModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: true },
    desc: { type: DataTypes.STRING, allowNull: true },
    count: { type: DataTypes.INTEGER, allowNull: true },
    comment: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: true },
    executor: { type: DataTypes.STRING, allowNull: true },
    executorName: { type: DataTypes.STRING, allowNull: true },
    executorSurname: { type: DataTypes.STRING, allowNull: true },
    condition: { type: DataTypes.STRING, allowNull: true },
    category_id: { type: DataTypes.STRING, allowNull: true },
    subcategory_id: { type: DataTypes.STRING, allowNull: true },
    object_title: { type: DataTypes.STRING, allowNull: true },
    check: { type: DataTypes.BOOLEAN, allowNull: true },
    done: { type: DataTypes.BOOLEAN, allowNull: true },
    show: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "VacancyModel" }
);

class MarkModel extends Model {}
MarkModel.init(
  {
    userID: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: true },
    surname: { type: DataTypes.STRING, allowNull: true },
    count: { type: DataTypes.INTEGER, allowNull: true },
    date: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "MarkModel" }
);
// finalize
module.exports = {
  sequelize,
  UserModel,
  ObjectModel,
  WorkModel,
  CategoryModel,
  SubcategoryModel,
  VacancyModel,
  MarkModel,
};
