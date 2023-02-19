export default () => ({
  db: {
    host: process.env.TEST_DB_HOST,
    posr: process.env.TEST_DB_PORT,
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    name: process.env.TEST_DB_NAME,
  },
});
