"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Admin 1",
          email: "admin1@mail.com",
          password: "$2b$10$d0y4l/bl09TqaM3kpc4ED.e5W6vkiZXVJGb1cbyoUq4pi03siFRJG",
          status: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
