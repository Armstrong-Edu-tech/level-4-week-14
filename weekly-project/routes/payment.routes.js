const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

router.post('/intent', authenticate, authorize('customer'), 
            paymentController.createPaymentIntent);

module.exports = router;