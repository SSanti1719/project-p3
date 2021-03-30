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

const sendgrid = {
  key: process.env.SENDGRID_API_KEY,
  email: process.env.SENDGRID_EMAIL,
};

export {mongodb, sendgrid};
