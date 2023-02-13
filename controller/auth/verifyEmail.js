const sgMail = require("@sendgrid/mail");
const { User } = require("../../models");
const { RequestError } = require("../../helpers");

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw RequestError(404, "Not found");
  }

  const { email } = user;
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: "goitnodejshw@gmail.com",
    subject: "Thank you for registration",
    text: `successfully registered`,
    html: `successfully registered`,
  };

  await sgMail.send(msg);

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      message: "Verification successful",
    },
  });
};

module.exports = verifyEmail;
