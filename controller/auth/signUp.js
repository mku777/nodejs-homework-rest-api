const sgMail = require("@sendgrid/mail");
const { User } = require("../../models");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const { RequestError, sendEmail } = require("../../helpers");
require("dotenv").config();

const { BASE_URL } = process.env;

const signUp = async (req, res) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw RequestError(409, "Email in use");
  }

  const avatarURL = gravatar.url(email, { protocol: "https" });
  const verificationToken = nanoid();

  const newUser = new User({ name, email, avatarURL, verificationToken });
  newUser.setPassword(password);
  await newUser.save();

  await sendEmail(email, verificationToken);

  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      user: {
        name: newUser.name,
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    },
  });
};

module.exports = signUp;
