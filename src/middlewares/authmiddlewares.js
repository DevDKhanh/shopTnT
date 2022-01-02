require('dotenv').config();
const validator = require('validator');
const dbCart = require('../controller/model/cart');
const dbOrder= require('../controller/model/order');
const jwt = require('jsonwebtoken');

module.exports.requireLogged = function (req, res, next) {
    if (req.session.token) {
        res.redirect('/');
        return;
    } else {
        return next();
    }
};

module.exports.requireisLog = function (req, res, next) {
    if (req.session.token) {
        jwt.verify(req.session.token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) {
                return res.redirect('/account/login');
            } else {
                return next();
            }
        });
    } else {
        return res.redirect('/account/login');
    }
};

module.exports.requireLogin = function (req, res, next) {
       if (req.session.token) {
        jwt.verify(req.session.token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) {
                return next();
            } else {
                Promise.all([
                    dbCart.countDocuments({ idUser: data.idUser, status: 'active'}),
                    dbOrder.countDocuments({ idUser: data.idUser, isCancel: false , isDone: false}),
                ])
                .then(([countCart, countOrder]) => {
                    req.session.UserLogin = {
                        isAdmin: data.isAdmin,
                        idUser: data.idUser,
                        nameUser: data.nameUser,
                        provider: data.provider,
                    }
                    res.locals.nameUser = data.nameUser;
                    res.locals.isAdmin = data.isAdmin;
                    res.locals.countCart = countCart;
                    res.locals.countOrder = countOrder;
                    return next();
                })
                .catch(() => next());
            }
        })
    } else {
        return next();
    }
};

module.exports.requireAdmin = function (req, res, next) {
    if (req.session.token) {
        jwt.verify(req.session.token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) {
                return res.redirect(`/`);
            } else {
               if (data.isAdmin) {
                   return next()
               } else {
                return res.redirect(`/`);
               }
            }
        })
    } else {
        return res.redirect(`/`);
    }
};

module.exports.countCart = function (req, res, next) {
    if (req.session.token) {
        jwt.verify(req.session.token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) {
                return res.redirect(`/`);
            } else {
                dbCart.countDocuments({ idUser: data.idUser , status: 'active'})
                .then((number)=> {
                    if (number>0) {
                        return next();
                    }else {
                        res.redirect('/');
                    }
                })
                .catch(()=> res.redirect('/'));
            }
        })
    } else {
        return res.redirect(`/`);
    }
};

module.exports.connectUser = function (req, res, next) {
    const token = jwt.sign({connect: true}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10s'});
    res.locals.tokenConnect = token;
    next();
}
