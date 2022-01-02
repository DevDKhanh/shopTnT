const express = require('express');
const router = express.Router();
const meController = require('../controller/meController');
const authMiddleware = require('../middlewares/authmiddlewares');

router.get('/cart', meController.cart);
router.get('/order', meController.order);
router.get('/checkout', authMiddleware.countCart, meController.checkout);
router.post('/newAddr', meController.newAddr);
router.delete('/delAddr', meController.delAddr);

module.exports = router;
