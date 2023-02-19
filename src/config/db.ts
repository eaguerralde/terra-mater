export default () => ({
  db: {
    host: process.env.DB_HOST,
    posr: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
});
