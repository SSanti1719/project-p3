import dotenv from 'dotenv';
dotenv.config();
const mongodb = {
  uri: process.env.MONGO_URI,
  host: process.env.MONGO_HOST,
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PASSWORD,
  db_name: process.env.MONGO_DB_NAME,
  port: 27017,
};
export {mongodb};
