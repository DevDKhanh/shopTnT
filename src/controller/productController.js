require('dotenv').config();
const dbCart = require('./model/cart');
const dbAddr = require('./model/address');
const dbProduct = require('./model/product');
const dbOrder = require('./model/order');
const validator = require('validator');
const sanitizer = require('sanitizer');

const xss = (str)=> {
    return sanitizer.sanitize(sanitizer.escape(str));
}

const { Socket } = require('../middlewares/socketO');

class ProductController {
    buynow(req, res, next) {
        if (req.session.UserLogin) {
            dbProduct
                .findOne({ slug: xss(req.params.slug) })
                .then((data) => {
                    if (data.available > 0) {
                        const product = data;
                        dbCart
                            .findOne({
                                idUser: req.session.UserLogin.idUser,
                                idProduct: product._id,
                            })
                            .then((info) => {
                                if (info) {
                                    return dbCart.updateOne(
                                        {
                                            idUser: req.session.UserLogin.idUser,
                                            idProduct: product._id,
                                        },
                                        { quantity: info.quantity + 1 , status: 'active'},
                                    );
                                } else {
                                    const addCart = new dbCart({
                                        idUser: req.session.UserLogin.idUser,
                                        idProduct: product._id,
                                        price: Number(product.price),
                                        img: product.image,
                                        bought: product.bought,
                                        slug: product.slug,
                                        nameUser:req.session.UserLogin.nameUser,
                                        nameProduct: product.productname,
                                    });
                                    return addCart.save();
                                }
                            })
                            .then(() => {
                                res.redirect('/me/cart');
                            })
                            .catch(next);
                    } else {
                        return res.send('Đã xảy ra lỗi');
                    }
                })
                .catch(next);
        } else {
            return res.redirect('/account/login');
        }
    }

    addcart(req, res, next) {
        if (req.session.UserLogin) {
            dbProduct
                .findOne({ slug: xss(req.body.slug) })
                .then((data) => {
                    if (data.available > 0) {
                        const product = data;
                        dbCart
                            .findOne({
                                idUser: req.session.UserLogin.idUser,
                                idProduct: product._id,
                            })
                            .then((info) => {
                                if (info) {
                                    return dbCart.updateOne(
                                        {
                                            idUser: req.session.UserLogin.idUser,
                                            idProduct: product._id,
                                        },
                                        { quantity: info.quantity + 1 , status: 'active'},
                                    );
                                } else {
                                    const addCart = new dbCart({
                                        idUser: req.session.UserLogin.idUser,
                                        idProduct: product._id,
                                        bought: product.bought,
                                        price: Number(product.price),
                                        img: product.image,
                                        slug: product.slug,
                                        nameUser: req.session.UserLogin.nameUser,
                                        nameProduct: product.productname,
                                    });
                                    return addCart.save();
                                }
                            })
                            .then(() => {
                                return dbCart.countDocuments({ idUser: req.session.UserLogin.idUser , status: 'active'})
                            })
                            .then((number)=> {
                                return res.json(number)
                            })
                            .catch(next);
                    } else {
                        return res.send('error');
                    }
                })
                .catch(next);
        } else {
            return res.send('login');
        }
    }

    minusCart(req, res, next) {
        if (req.session.UserLogin) {
            dbCart.findOne({
                idUser: req.session.UserLogin.idUser,
                slug: xss(req.body.slug),
            })
            .then((data)=> {
                if (data.quantity > 1) {
                    return dbCart.updateOne(
                        {
                            idUser: req.session.UserLogin.idUser,
                            slug: req.body.slug,
                        },
                        { quantity: data.quantity - 1 },
                    );
                }else {
                    return null;
                }
            })
            .then(()=> {
                return dbCart.find({
                    idUser: req.session.UserLogin.idUser,
                    status: 'active',
                });
            })
            .then((update)=> {
                const cart = update.map(value=> {
                    const newdata = {
                        nameProduct: value.nameProduct,
                        quantity: value.quantity,
                        price: value.price,
                        img: value.img,
                        slug: value.slug,
                    };
                    return newdata
                });
                res.json(cart)
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }

    plusCart(req, res, next) {
        if (req.session.UserLogin) {
            dbCart.findOne({
                idUser: req.session.UserLogin.idUser,
                slug: xss(req.body.slug),
            })
            .then((data)=> {
                return dbCart.updateOne(
                    {
                        idUser: req.session.UserLogin.idUser,
                        slug: req.body.slug,
                    },
                    { quantity: data.quantity + 1 },
                );
            })
            .then(()=> {
                return dbCart.find({
                    idUser: req.session.UserLogin.idUser,
                    status: 'active',
                });
            })
            .then((update)=> {
                const cart = update.map(value=> {
                    const newdata = {
                        nameProduct: value.nameProduct,
                        quantity: value.quantity,
                        price: value.price,
                        img: value.img,
                        slug: value.slug,
                    };
                    return newdata
                });
                res.json(cart)
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }

    delCart(req, res, next) {
        if (req.session.UserLogin) {
            dbCart.updateOne(
                {
                    idUser: req.session.UserLogin.idUser,
                    slug: xss(req.body.slug),
                    status: 'active',
                },
                { status: 'deleted', quantity: 0},
            )
            .then(()=> {
                return Promise.all([
                    dbCart.countDocuments({ idUser: req.session.UserLogin.idUser , status: 'active'}),
                    dbCart.find({
                        idUser: req.session.UserLogin.idUser,
                        status: 'active',
                    })
                ]);
            })
            .then(([number, update])=> {
                let cart = [];
                update.map(value=> {
                    const newdata = {
                        number: number,
                        nameProduct: value.nameProduct,
                        quantity: value.quantity,
                        price: value.price,
                        img: value.img,
                        slug: value.slug,
                    };
                    cart.push(newdata);
                });
                if (update.length > 0) {
                    res.json(cart); 
                }else {
                    res.json(number);
                }
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }

    checkout (req, res, next) {
        const idAddr = xss(req.body.idAddr);
        const note = xss(req.body.note);
        if (req.session.UserLogin) {
            Promise.all([
                dbCart.find({idUser: req.session.UserLogin.idUser, status: 'active'}),
                dbAddr.find({_id: idAddr, idUser: req.session.UserLogin.idUser})
            ])
            .then(([data,address]) => {
                if (data && address) {
                    if (
                        validator.equals(validator.trim(idAddr, ''),'')
                    ){
                        return res.send('validator');                        
                    }else {
                        const totalPay = data.reduce((a, b)=>{ return a + (Number(b.price)*Number(b.quantity))},0);
                        const newOrder = new dbOrder({
                            idUser: req.session.UserLogin.idUser,
                            addr: address[0],
                            nameUser: req.session.UserLogin.nameUser,
                            total: totalPay,
                            note: note,
                            listProduct: data
                        });
                        Promise.all([
                            dbCart.updateMany(
                                {
                                    idUser: req.session.UserLogin.idUser,
                                    status: 'active',
                                },
                                { status: 'deleted', quantity: 0},
                            ),
                            newOrder.save()
                        ])
                        .then(()=> {
                            return Promise.all([
                                dbCart.countDocuments({ 
                                    idUser: req.session.UserLogin.idUser,
                                    status: 'active'
                                }),
                                dbCart.find({
                                    idUser: req.session.UserLogin.idUser,
                                    status: 'active',
                                }),
                                dbOrder.countDocuments({
                                    idUser: req.session.UserLogin.idUser,
                                    status: 'active',
                                }),
                            ]); 
                        })
                        .then(([numbercart, update, numberorder])=> {
                            Socket.emit('checkout-order');
                            Socket.emit('render-admin-order');
                            if (update.length > 0) {
                                res.json('error'); 
                            }else {
                                res.status(200).json([numbercart, numberorder]);
                            }
                        })
                        .catch(next);
                    }
                }
            })
            .catch(next);
        }else {
            res.redirect('/');
        }
    }

    cancelorder (req, res, next) {
        dbOrder.updateOne({_id: req.body.id, isCancel: false, isCheck: false}, {isCancel: true})
        .then((data)=> {
            if (data.n > 0 && data.ok == 1) {
                dbOrder.countDocuments({ idUser: req.session.UserLogin.idUser, isCancel: false })
                .then((number)=> {
                    Socket.emit('cancel-order');
                    Socket.emit('render-admin-order');
                    res.json(number);
                })
            }else {
                res.send('error');
            }
        })
        .catch(next);
    }
    
    reorder (req, res, next) {
        dbOrder.updateOne({_id: req.body.id, isCancel: true, isCheck: false}, {isCancel: false})
        .then((data)=> {
            if (data.n > 0 && data.ok == 1) {
                dbOrder.countDocuments({ idUser: req.session.UserLogin.idUser, isCancel: false })
                .then((number)=> {
                    Socket.emit('checkout-order');
                    Socket.emit('render-admin-order');
                    res.json(number);
                })
            }else {
                res.send('error');
            }
        })
        .catch(next);
    }
}

module.exports = new ProductController();
