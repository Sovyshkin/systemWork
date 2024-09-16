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
    username: { type: DataTypes.STRING, allowNull: true },
    surname: { type: DataTypes.STRING, allowNull: true },
    login: { type: DataTypes.STRING, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize, modelName: "UserModel" }
);

class ServiceModel extends Model {}
ServiceModel.init(
  {
    title: { type: DataTypes.STRING, allowNull: true },
    desc: { type: DataTypes.STRING, allowNull: true },
    img: { type: DataTypes.JSON, allowNull: true },
    ru: { type: DataTypes.BOOLEAN, allowNull: true },
  },
  { sequelize, modelName: "ServiceModel" }
);

// finalize
module.exports = {
  sequelize,
  UserModel,
  ServiceModel,
};
