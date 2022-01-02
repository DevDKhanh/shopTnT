const express = require('express');
const router = express.Router();
const passport = require('passport');
const accountController = require('../controller/accountController');

router.post('/signup', accountController.signup);
router.post('/login', accountController.login);
router.get('/login', accountController.pageLogin);
router.get('/signup', accountController.pageSignup);

// social network

router.get('/facebook', 
    passport.authenticate('facebook',{scope:'email'})
);

router.get('/facebook/callback', 
    passport.authenticate('facebook', { successRedirect : '/account/social-network/login', failureRedirect: '/login' }), 
    accountController.socialloged
);

router.get('/google', 
    passport.authenticate('google', {scope: ['profile', 'email']})
);

router.get('/google/callback', 
    passport.authenticate('google', { successRedirect : '/account/social-network/login', failureRedirect: '/login' }), 
    accountController.socialloged
);

router.get('/social-network/login', 
    accountController.social
);

module.exports = router;
