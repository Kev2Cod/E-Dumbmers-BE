module.exports = {
  development: {
    username: "dumbmers",
    password: "mydatabasesecret",
    database: "dumbmers_db",
    host: "mydbdumbmers.c9kzegtqoyfp.us-east-2.rds.amazonaws.com",
    port: 5432,
    dialect: "postgres",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  development: {
    username: "dumbmers",
    password: "mydatabasesecret",
    database: "dumbmers_db",
    host: "mydbdumbmers.c9kzegtqoyfp.us-east-2.rds.amazonaws.com",
    port: 5432,
    dialect: "postgres",
  },
};

// {
//   "development": {
//     "username": "dumbmers",
//     "password": "mydatabasesecret",
//     "database": "dumbmers_db",
//     "host": "mydbdumbmers.c9kzegtqoyfp.us-east-2.rds.amazonaws.com",
//     "port": 5432,
//     "dialect": "postgres"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "use_env_variable": "DATABASE_URL",
//     "dialect": "postgres",
//     "protocol": "postgres",
//     "dialectOptions": {
//       "ssl": {
//         "require": true,
//         "rejectUnauthorized": false
//       }
//     }
//    }
// }
