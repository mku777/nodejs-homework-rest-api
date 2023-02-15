const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fromEmail = process.env.SENDGRID_EMAIL;

const sendEmail = async (email, verificationToken) => {
  const msg = {
    to: email,
    from: fromEmail,
    subject: "Account activation",
    text: `Please click to activate you account http://localhost:3000/api/users/verify/${verificationToken}`,
    html: `Please  <a href="http://localhost:3000/api/users/verify/${verificationToken}">click</a> to activate your account`,
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;
