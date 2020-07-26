const express = require('express');
const router = express.Router();
const checkAuth = require('../security/check-auth');

const orderService = require('../services/order.service');

router.get('/', checkAuth, orderService.order_getAll);

router.post('/', checkAuth, orderService.order_createNew);

router.get('/:orderId', checkAuth, orderService.order_getById);

router.patch('/:orderId', checkAuth, orderService.order_updateById);

router.delete('/:orderId', checkAuth, orderService.order_deleteById);

module.exports = router;