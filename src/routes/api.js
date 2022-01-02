const express = require('express');
const router = express.Router();
const apiController = require('../controller/apiController');
const authMiddleware = require('../middlewares/authmiddlewares');

router.get('/product', apiController.getProduct);
router.get('/order/me', apiController.order);
router.get('/cart/me', apiController.cart);
router.get('/getAddr/me', apiController.getAddr);
router.get('/orderAll/admin', authMiddleware.requireAdmin, apiController.orderAll);
router.get('/orderCheck/admin', authMiddleware.requireAdmin, apiController.orderCheck);
router.get('/orderShip/admin', authMiddleware.requireAdmin, apiController.orderShip);
router.get('/orderDone/admin', authMiddleware.requireAdmin, apiController.orderDone);
router.get('/orderCancel/admin', authMiddleware.requireAdmin, apiController.orderCancel);

module.exports = router;
