const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getCustomers);
router.get("/:id", userController.getUserById);
router.delete("/:id", userController.deleteUser);
router.put("/:id", userController.updateUser);

module.exports = router;