const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const authMiddleware = require('../middlewares/authmiddlewares');

router.get('/:slug/buy', productController.buynow);
router.post('/addCart', productController.addcart);
router.put('/minusCart', productController.minusCart);
router.put('/plusCart', productController.plusCart);
router.put('/delCart', productController.delCart);
router.post('/checkout', authMiddleware.countCart, productController.checkout);
router.put('/cancel-order', productController.cancelorder);
router.put('/re-order', productController.reorder);

module.exports = router;
