const express = require("express");
const router = express.Router();
const validate = require("./validation");
const userController = require("../../../controller/users");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");
const { createAccountLimiter } = require("../../../helpers/rate-limit-reg");

router.post(
  "/auth/register",
  createAccountLimiter,
  validate.addUser,
  userController.register
);
router.post("/auth/login", userController.login);
router.post("/auth/logout", guard, userController.logout);
router.get("/current", guard, userController.currentUser);
router.patch(
  "/sub/:id",
  guard,
  validate.updateSub,
  userController.updateSubscription
);
router.patch(
  "/avatars",
  [guard, upload.single("avatar"), validate.validateUploadAvatar],
  userController.avatars
);
router.get("/auth/verify/:verificationToken", userController.verify);

module.exports = router;
