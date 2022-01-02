const express = require('express');
const router = express.Router();
const siteController = require('../controller/siteController');

router.get('/logout', siteController.logout);
router.get('/seemore/:slug', siteController.seemorePrd);
router.get('/search', siteController.search);
router.get('/danhmuc/:name', siteController.danhmuc);
router.post('/fcm', siteController.fmc);
router.get('/', siteController.index);
router.use(siteController.page404);

module.exports = router;
