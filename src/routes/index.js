const siteRouter = require('./site');
const adminRouter = require('./admin');
const apiRouter = require('./api');
const buyerRouter = require('./buyer');
const accountRouter = require('./account');
const meRouter = require('./me');
const authMiddleware = require('../middlewares/authmiddlewares');

function route(app) {
    app.use('/api', apiRouter);

    app.use('/admin', 
        authMiddleware.requireAdmin, 
        adminRouter
    );

    app.use('/buyer', 
        authMiddleware.requireisLog, 
        buyerRouter
    );

    app.use(
        '/me',
        authMiddleware.requireisLog,
        authMiddleware.requireLogin,
        meRouter,
    );

    app.use('/account', 
        authMiddleware.requireLogged, 
    accountRouter);

    app.use('/', 
        authMiddleware.requireLogin, 
        siteRouter
    );
}

module.exports = route;
