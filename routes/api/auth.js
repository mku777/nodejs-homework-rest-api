const express = require("express");
const { validation, ctrlWrapper, checkJwt } = require("../../middlewares");
const { joiUserSchemas } = require("../../models");
const { auth: ctrl } = require("../../controller");

const router = express.Router();

router.post("/register", validation(joiUserSchemas.joiSingUpSchema), ctrlWrapper(ctrl.signUp));
router.post("/login", validation(joiUserSchemas.joiSingInSchema), ctrlWrapper(ctrl.signIn));
router.get("/logout", checkJwt, ctrlWrapper(ctrl.logOut));

router.get("/verify/:verificationToken", ctrlWrapper(ctrl.verifyEmail));
router.post(
    "/verify",
    validation(joiUserSchemas.joiVerifyEmailSchema),
    ctrlWrapper(ctrl.resendEmail)
);

module.exports = router;
