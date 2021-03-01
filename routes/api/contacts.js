const express = require("express");
const router = express.Router();
const validate = require("./validation");
const contactsController = require("../../controller/contacts");

router
  .get("/", contactsController.getAll)
  .post("/", validate.addContact, contactsController.create);

router
  .get("/:id", contactsController.getById)
  .delete("/:id", contactsController.remove)
  .patch("/:id", validate.updateContact, contactsController.update);

module.exports = router;
