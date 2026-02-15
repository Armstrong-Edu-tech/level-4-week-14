const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authenticate = require("../middleware/auth.middleware");
const authorize = require('../middleware/role.middleware');

router.post("/", authenticate, authorize('customer'),orderController.createOrder);

module.exports = router;