const dbCart = require('./model/cart');
const dbOrder = require('./model/order');
const dbAddr = require('./model/address');
const { mutipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');
const { Socket } = require('../middlewares/socketO');

class MeController {
    cart(req, res, next) {
        const title = 'Giỏ hàng';
        if (req.session.UserLogin) {
            dbCart
                .find({
                    idUser: req.session.UserLogin.idUser,
                    status: 'active',
                })
                .then((order) => {
                    const totalPrice = order.reduce((a, b) => {
                        return a + b.price;
                    }, 0);
                    res.render('me/cart', {
                        title,
                        order: mutipleMongooseToObject(order),
                        totalPrice,
                    });
                })
                .catch(next);
        } else {
            res.redirect('/');
        }
    }

    order(req, res, next) {
        const title = 'Các đơn hàng của bạn';
        if (req.session.UserLogin) {
            res.render('me/order', { title });
        } else {
            res.redirect('/');
        }
    }

    checkout(req, res, next) {
        const title = 'Đặt hàng';
        if (req.session.UserLogin) {
            res.render('me/checkout', { title });
        } else {
            res.redirect('/');
        }
    }

    async newAddr (req, res, next) {
        const countAddr = await dbAddr.countDocuments({idUser: req.session.UserLogin.idUser})
        if (countAddr < 3) {
            try {
                const newAddr = await new dbAddr({
                    idUser: req.session.UserLogin.idUser,
                    ...req.body
                })
                newAddr.save(()=> res.json('success'));
            } catch (err) {
                res.json('error');
            }
        } else {
            res.json('full');
        }
    }

    delAddr (req, res, next) {
        dbAddr.deleteOne({idUser: req.session.UserLogin.idUser, _id: req.body.id})
        .then(()=> res.json('success'))
        .catch(()=> res.json('err'));
    }
}

module.exports = new MeController();
