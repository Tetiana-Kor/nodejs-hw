const express = require("express");
const router = express.Router();
const validate = require("./validation");
const userController = require("../../../controller/users");
const guard = require("../../../helpers/guard");

router.post("/auth/register", validate.addUser, userController.register);
router.post("/auth/login", userController.login);
router.post("/auth/logout", guard, userController.logout);

module.exports = router;
