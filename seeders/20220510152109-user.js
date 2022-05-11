"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Admin 1",
          email: "admin1@mail.com",
          password: "$2b$10$GMesDJo3fh9xtKFz58nimODJsTj2Kj6xRxsNJwYOHZLxiQfGqGfeK",
          status: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
