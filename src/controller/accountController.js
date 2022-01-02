require('dotenv').config();
const dbUser = require('./model/user');
const dbCart = require('./model/cart');
const validator = require('validator');
const pbkdf2 = require('pbkdf2');
const { Socket } = require('../middlewares/socketO');
const jwt = require('jsonwebtoken');
const sanitizer = require('sanitizer');
const xss = (str)=> {
    return sanitizer.sanitize(sanitizer.escape(str));
};

class AccountController {
    pageLogin(req, res, next) {
        const title = 'Trang đăng nhập';
        res.render('auth/login', { title, pagelogin: true, hide: true });
    }

    pageSignup(req, res, next) {
        const title = 'Trang đăng ký';
        res.render('auth/signup', { title, pagesignup: true, hide: true });
    }

    signup(req, res, next) {
        const username = xss(req.body.nameuser.toLowerCase(),{});
        const phone = xss(req.body.phone,{});
        const password_1 = xss(req.body.password_1,{});
        const password_2 = xss(req.body.password_2,{});

        if (username && phone && password_1 && password_2) {
            if (
                validator.equals(validator.trim(username, ''), '') ||
                validator.equals(validator.trim(phone, ''), '') ||
                validator.equals(validator.trim(password_1, ''), '') ||
                validator.equals(validator.trim(password_2, ''), '')
            ) {
                res.send('Vui lòng nhập đầy đủ!');
                return;
            }

            if (validator.contains(username, ' ')) {
                res.send('Tên đăng nhập phải được viết liền');
                return;
            }

            if (isUsernameError(username)) {
                res.send(
                    'Tên đăng nhập bao gồm a-z, A-Z, 0-9 <br> không chứa kí tự đặc biệt, 3-22 kí tự!',
                );
                return;
            }

            if (password_1 === password_2) {
                if (validator.isLength(validator.trim(password_1), 5, 20)) {
                    dbUser
                        .findOne({ username: username })
                        .then((data) => {
                            if (data) {
                                return 'data-user';
                            } else {
                                return dbUser.findOne({ phone: phone });
                            }
                        })
                        .then((data) => {
                            if (data) {
                                if (data == 'data-user') {
                                    res.send('Tên tài khoản đã tồn tại!');
                                } else {
                                    res.send('Số điện thoại đã được sử dụng!');
                                }
                                return;
                            } else {
                                const derivedKey = pbkdf2.pbkdf2Sync(
                                    password_1,
                                    'salt',
                                    1,
                                    32,
                                    'sha512',
                                );
                                const newUser = new dbUser({
                                    username: username,
                                    phone: phone,
                                    password: derivedKey,
                                });
                                newUser.save((error) => {
                                    if (error) {
                                        res.send('Không thể đăng ký, có lỗi');
                                    } else {
                                        res.send('success');
                                    }
                                });
                                return;
                            }
                        })
                        .catch(next);
                } else {
                    res.send('Mật khẩu phải từ 5 đến 20 kí tự!');
                    return;
                }
            } else {
                res.send('Mật khẩu nhập lại không trùng khớp!');
                return;
            }
        } else {
            res.send('Nhập đầy đủ các thông tin');
        }

        function isUsernameError(str) {
            const REGEX =
                /^(?=.{4,22}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
            return str.match(REGEX) == null ? true : false;
        }
    }

    login(req, res, next) {
        const username = xss(req.body.nameuser.toLowerCase(),{});
        const password = xss(req.body.password,{});
        const derivedKey = pbkdf2.pbkdf2Sync(password, 'salt', 1, 32, 'sha512');

        if (
            validator.equals(validator.trim(username, ''), '') ||
            validator.equals(validator.trim(password, ''), '')
        ) {
            res.send('Vui lòng nhập đầy đủ!');
        } else {
            dbUser
                .findOne({ username: username, password: derivedKey })
                .then((usernamelog) => {
                    if (usernamelog) {
                        return usernamelog;
                    } else {
                        return dbUser.findOne({
                            email: username,
                            password: derivedKey,
                        });
                    }
                })
                .then((emaillog) => {
                    if (emaillog) {
                        const data = {
                            isAdmin: emaillog.isAdmin,
                            idUser: emaillog._id,
                            nameUser: emaillog.username,
                            provider: emaillog.provider,
                        }
                        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
                        req.session.token = accessToken;
                        res.json('success');
                    } else {
                        res.send('Mật khẩu hoặc tài khoản sai!');
                    }
                })
                .catch(next);
        }
    }

    social (req, res, next) {
        if(req.session.passport) {
            dbUser.findOne({ socialId: req.session.passport.user.id })
            .then((user)=> {
                if (user) {
                    const data = {
                        isAdmin: user.isAdmin,
                        idUser: user._id,
                        nameUser: user.username,
                        provider: user.provider,
                    };
                    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
                    req.session.token = accessToken;
                    return null;
                }else {
                    const newUser = new dbUser({
                        username: req.session.passport.user.displayName,
                        passWord: null,
                        socialId: req.session.passport.user.id,
                        provider: req.session.passport.user.provider
                    });
                    return newUser.save();
                }
            })
            .then((user) => {
                if(user) {
                    const data = {
                        isAdmin: user.isAdmin,
                        idUser: user._id,
                        nameUser: user.username,
                        provider: user.provider,
                    };
                    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
                    req.session.token = accessToken;
                    res.redirect('/');
                }else {
                    res.redirect('/');
                }
            })
            .catch(next);
        }else {
            res.redirect('/');
        }
    }

    socialloged (req, res, next) {
        res.redirect('/');
    }
}

module.exports = new AccountController();
