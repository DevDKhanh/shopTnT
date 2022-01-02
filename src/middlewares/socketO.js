const io = require('socket.io')();

const dbProduct = require('../controller/model/product');

let Socket = {
    emit: function (event, data) {
        io.sockets.emit(event, data);
    }
};

io.on('connection', function (socket) {
    
    socket.on('get-data-products', () => {
        dbProduct
            .find({})
            .sort({ createdAt: -1 })
            .then((data) => {
                socket.emit('send-data-client', data);
            })
            .catch();
    });

    socket.on('edit-product', (id) => {
        dbProduct
            .findOne({ _id: id })
            .then((data) => {
                if (data) {
                    socket.emit('send-data-edit', data);
                }
            })
            .catch();
    });

    socket.on('get-data-trash', () => {
        dbProduct.find({}).then((data) => {
            socket.emit('send-data-trash', data);
        });
    });
});

exports.Socket = Socket;
exports.io = io;
