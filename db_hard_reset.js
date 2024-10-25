let { sequelize, UserModel } = require("./modules/models");
const bcrypt = require("bcryptjs");

const load_info = async () => {
  await sequelize.drop();
  await sequelize.sync({
    alter: true,
  });
  console.log("tables synchronized.");

  let user = await UserModel.findOne({
    where: {
      name: "Admin",
      surname: "Adminov",
      phone: "+7944944",
      role: "Администратор",
    },
  });
  if (!user) {
    const newUser = await UserModel.create({
      name: "Admin",
      surname: "Adminov",
      phone: "+7944944",
      role: "Администратор",
      accrued: 0,
      paid: 0,
      total: 0,
    });

    await newUser.save();
  }

  console.log("done.");
};

load_info();
