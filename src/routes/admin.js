const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controller/adminController');
const authMiddleware = require('../middlewares/authmiddlewares');
const upload = require('../util/multer');

//Router
router.post('/addproduct', upload.single('image'), adminController.addProduct);
router.put(
    '/updateproduct',
    upload.single('image'),
    adminController.updateProduct,
);
router.put('/trash/:id', adminController.trash);
router.put('/back-product/:id', adminController.backPrd);
router.delete('/delete-product/:id', adminController.deletePrd);
router.get('/donhang', adminController.order);
router.get('/khachhang', adminController.user);
router.put('/isCheck', adminController.isCheck);
router.put('/isShipping', adminController.isShipping);
router.put('/isDone', adminController.isDone);
router.get('/seeNote/:id', adminController.seeNote);
router.get('/seeInfoOrder/:id', adminController.seeInfoOrder);
router.get('/', adminController.index);

module.exports = router;
