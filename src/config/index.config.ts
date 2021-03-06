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

const jwt = {
  secret_Key: process.env.JWT_SECRET_KEY,
  expiration_time: process.env.JWT_EXPIRATION_TIME,
};

const cloudinary = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const roles = {
  admin: 1,
  seller: 2,
};

const emailTypes = {
  sign_up: 'signUp',
  change_password: 'change-password',
  reset_password: 'reset-password',
  request_create: 'request-create',
  request_update: 'request-update',
  client_offer: 'client-offer',
  client_payment: 'client-payment',
};

const requestStatus = {
  review: 'EN ESTUDIO',
  accepted: 'ACEPTADA',
  rejected: 'RECHAZADA',
};

const codeTypes = {
  city: 'CT',
  project: 'PJ',
  block: 'BK',
  property: 'PT',
  request: 'RQ',
  payment: 'PY',
};

const propertyStatus = {
  available: 'DISPONIBLE',
  sold: 'VENDIDA',
};

const cloudFilesRoutes = {
  projects: 'inmobi/projects',
  clients: 'inmobi/clients',
  payments: 'inmobi/payments',
};

const twilio = {
  account_sid: process.env.TWILIO_SID,
  auth_token: process.env.TWILIO_TOKEN,
  phone_number: process.env.TWILIO_NUMBER,
};

export {
  mongodb,
  sendgrid,
  jwt,
  roles,
  emailTypes,
  requestStatus,
  cloudinary,
  codeTypes,
  propertyStatus,
  cloudFilesRoutes,
  twilio,
};
