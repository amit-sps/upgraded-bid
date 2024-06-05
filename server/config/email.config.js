require("dotenv").config();
module.exports = Object.freeze({
    HOST: process.env.HOST,
    SERVICE: process.env.SERVICE,
    MAIL_USERNAME : process.env.MAIL_USERNAME,
    MAIL_PASSWORD : process.env.MAIL_PASSWORD,
    MAIL_FROM_ADDRESS : process.env.MAIL_FROM_ADDRESS,
  });