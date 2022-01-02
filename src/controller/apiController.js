const dbProduct = require('../controller/model/product');
const dbOrder = require('../controller/model/order');
const dbCart = require('../controller/model/cart');
const dbAddr = require('../controller/model/address');

class AdminController {
    getProduct(req, res, next) {
        dbProduct
            .find({ status: 'active' })
            .sort({ createdAt: -1 })
            .then((data) => {
                let products = data.map((value) => {
                    const newdata = {
                        productname: value.productname,
                        slug: value.slug,
                        available: value.available,
                        price: value.price,
                        classify: value.classify,
                        description: value.description,
                        image: value.image,
                        tradeMark: value.tradeMark,
                        star: value.star,
                        bought: value.bought,
                        productWarranty: value.productWarranty,
                        status: value.status,
                    };
                    return newdata;
                });
                res.json(products);
            })
            .catch(next);
    }

    order(req, res, next) {
        if (req.session.UserLogin) {
            dbOrder.find({idUser: req.session.UserLogin.idUser, status:'active'})
            .sort({ createdAt: -1 })
            .then((data)=> {
                const orders = data.map((newData)=>{
                    const dataSet = {
                        _id: newData._id,
                        phone: newData.phone,
                        nameUser: newData.nameUser,
                        total: newData.total,
                        address: newData.address,
                        listProduct: newData.listProduct,
                        isCheck: newData.isCheck,
                        isDone: newData.isDone,
                        isShipping: newData.isShipping,
                        isCancel: newData.isCancel,
                        status: newData.status,
                    }

                    return dataSet;
                });
                res.json(orders);
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }

    getAddr(req, res, next) {
        if (req.session.UserLogin) {
            dbAddr.find({idUser: req.session.UserLogin.idUser})
            .sort({ updatedAt: -1 })
            .then((data)=> {
                res.json(data);
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }

    cart(req, res, next) {
        if (req.session.UserLogin) {
            dbCart.find({idUser: req.session.UserLogin.idUser, status:'active'})
            .sort({ updatedAt: -1 })
            .then((data)=> {
                const cart = data.map((newData)=>{
                    const dataSet = {
                        nameProduct: newData.nameProduct,
                        quantity: newData.quantity,
                        price: newData.price,
                        img: newData.img,
                        slug: newData.slug,
                    }

                    return dataSet;
                });
                res.json(cart);
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }

    orderAll(req, res, next) {
        if (req.session.UserLogin) {
            dbOrder.find()
            .sort({ createdAt: -1 })
            .then((data)=> {
                res.json(data);
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }

    orderCheck(req, res, next) {
        if (req.session.UserLogin) {
            dbOrder.find({isShipping: false, isCancel: false,status: 'active'})
            .sort({ createdAt: -1 })
            .then((data)=> {
                res.json(data);
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }

    orderShip(req, res, next) {
        if (req.session.UserLogin) {
            dbOrder.find({isCheck: true, isShipping: true, isDone: false, status: 'active'})
            .sort({ createdAt: -1 })
            .then((data)=> {
                res.json(data);
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }

    orderDone(req, res, next) {
        if (req.session.UserLogin) {
            dbOrder.find({isShipping: true, isDone: true, status: 'active'})
            .sort({ createdAt: -1 })
            .then((data)=> {
                res.json(data);
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }

    orderCancel(req, res, next) {
        if (req.session.UserLogin) {
            dbOrder.find({isCancel: true})
            .sort({ createdAt: -1 })
            .then((data)=> {
                res.json(data);
            })
            .catch(next);
        } else {
            res.redirect('/');
        }
    }
    
}

module.exports = new AdminController();
