const { User } = require("../../models");
const { RequestError, sendEmail } = require("../../helpers");
require("dotenv").config();

const resendEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw RequestError(401, "Email is wrong");
  }

  if (!user.verificationToken) {
    throw RequestError(400, "Verification has already been passed");
  }
  await sendEmail(email, user.verificationToken);

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      message: "Verification email sent",
    },
  });
};

module.exports = resendEmail;
