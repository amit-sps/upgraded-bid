const nodemailer = require("nodemailer");
const {
  HOST,
  SERVICE,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_ADDRESS,
} = require("../config/email.config");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: HOST,
      service: SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: MAIL_FROM_ADDRESS,
      to: email,
      subject: "Password Reset",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - Softprodigy Bidding Portal</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
              }
              .header {
                  background-color: #2d6cdf;
                  color: #ffffff;
                  padding: 20px;
                  text-align: center;
              }
              .header h1 {
                  margin: 0;
              }
              .content {
                  padding: 20px;
                  color: #333333;
              }
              .content p {
                  line-height: 1.6;
              }
              .button {
                  display: block;
                  width: 200px;
                  margin: 20px auto;
                  padding: 10px 20px;
                  text-align: center;
                  background-color: #2d6cdf;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .footer {
                  background-color: #f4f4f4;
                  color: #999999;
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
              }
              .footer p {
                  margin: 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Softprodigy Bidding Portal</h1>
              </div>
              <div class="content">
                  <h2>Password Reset Request</h2>
                  <p>Hello,</p>
                  <p>We received a request to reset your password for your Softprodigy Bidding Portal account. To reset your password, click the button below:</p>
                  <a href=${text} class="button">Reset Password</a>
                  <p><a href=${text}>${text}</a></p>
                  <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
                  <p>Thank you,<br>Softprodigy Bidding Portal Team</p>
              </div>
              <div class="footer">
                  <p>© 2024 Softprodigy Bidding Portal. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `,
    });

    console.log("Email sent successfully.");
  } catch (error) {
    console.log(error, "Email not sent.");
  }
};

module.exports = sendEmail;
