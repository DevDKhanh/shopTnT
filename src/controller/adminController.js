const dbProduct = require('../controller/model/product');
const dbOrder = require('../controller/model/order'); 

const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const { Socket } = require('../middlewares/socketO');
const cloudinary = require('../util/cloudinary');
const path = require('path');

class AdminController {
    index(req, res) {
        const title = 'Quản lí';
        res.render('admin/panel', { title, pageadmin: true });
    }

    async addProduct(req, res) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            req.body.image = result.secure_url;
            req.body.idImg = result.public_id;
            const newProduct = await new dbProduct(req.body);
            newProduct.save().then(() => res.redirect('/admin'));
        } catch(err) {
            res.redirect('/admin/addProduct');
        }
    }

    trash(req, res, next) {
        dbProduct
            .updateOne({ _id: req.params.id }, { status: 'Delete' })
            .then(() => {
                return dbProduct.find({}).sort({ createdAt: -1 });
            })
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }

    backPrd(req, res, next) {
        dbProduct
            .updateOne({ _id: req.params.id }, { status: 'active' })
            .then(() => {
                return dbProduct.find({});
            })
            .then((data) => {
                res.json(data);
            })
            .catch(next);
    }

    deletePrd(req, res) {
        dbProduct
            .findOne({ _id: req.params.id, status: 'Delete' })
            .then((value) => {
                if (value) {
                    dbProduct
                        .deleteOne({ _id: req.params.id, status: 'Delete' })
                        .then(() => {
                            dbProduct.find({}).then((data) => {
                                cloudinary.uploader.destroy(value.idImg);
                                res.json(data);
                            });
                        });
                } else {
                    res.json('lỗi');
                }
            });
    }

    async updateProduct(req, res, next) {
        const idPr = req.body._id;
        if (req.file) {
            req.body.image = req.file.path;
            const searchDB = await dbProduct.findOne({ _id: idPr });
            cloudinary.uploader.destroy(searchDB.idImg);
            const result = await cloudinary.uploader.upload(req.file.path);

            req.body.image = result.secure_url;
            req.body.idImg = result.public_id;

            await dbProduct.updateOne({_id: idPr}, {
                productname: req.body.productname,
                available: req.body.available,
                price: req.body.price,
                classify: req.body.classify,
                description: req.body.description,
                image: req.body.image,
                idImg: req.body.idImg,
                tradeMark: req.body.tradeMark,
                productWarranty: req.body.productWarranty,
            })
            .then(()=> res.redirect('/admin'));
        } else {
            dbProduct.updateOne({_id: idPr}, {
                productname: req.body.productname,
                available: req.body.available,
                price: req.body.price,
                classify: req.body.classify,
                description: req.body.description,
                tradeMark: req.body.tradeMark,
                productWarranty: req.body.productWarranty,
            })
            .then(()=> res.redirect('/admin'));
        }
    }

    order (req, res, next) {
        const title = 'Đơn hàng';
        res.render('admin/order', {title, pageadmin: true});
    }

    user (req, res, next) {
        const title = 'Khách hàng';
        res.render('admin/user', {title, pageadmin: true});
    }

    isCheck (req, res, next) {
        dbOrder.updateOne({_id: req.body.id},{isCheck: true})
        .then(()=>{
            Socket.emit('render-admin-order');
            res.send('success');
        })
        .catch(()=> res.send('error'));
    }

    isShipping (req, res, next) {
        dbOrder.updateOne({_id: req.body.id, isCheck: true},{isShipping: true})
        .then(()=>{
            Socket.emit('render-admin-order');
            res.send('success');
        })
        .catch(()=> res.send('error'));
    }

    isDone (req, res, next) {
        dbOrder.updateOne({_id: req.body.id, isCheck: true, isShipping: true},{isDone: true})
        .then(()=>{
            return dbOrder.findOne({_id: req.body.id, isCheck: true, isShipping: true});
        })
        .then(update=>{
            update.listProduct.forEach(product=>{
                dbProduct.updateOne({_id: product.idProduct}, {$inc: {bought: product.quantity}})
                .then();
            });
            return null;
        })
        .then(()=> {
            Socket.emit('render-admin-order-shipping');
            res.send('success');
        })
        .catch(()=> res.send('error'));
    }

    seeNote (req, res, next) {
        dbOrder.findOne({_id: req.params.id})
        .then(data=>{
            if(data.note && data.note!='') {
                res.send(data.note);
            } else {
                res.send('notfound');
            }
        })
        .catch(()=> res.send('err'));
    } 

    seeInfoOrder (req, res, next) {
        dbOrder.findOne({_id: req.params.id})
        .then(data=>{
            if(data) {
                res.send(data);
            } else {
                res.send('notfound');
            }
        })
        .catch(()=> res.send('err'));
    } 
}

module.exports = new AdminController();
