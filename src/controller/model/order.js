const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchame = new Schema(
    {
        idUser: { type: String, default: '',required: true },
        addr: { type: Object, default: '',required: true },
        nameUser: { type: String, default: '', required: true },
        total: { type: Number, required: true },
        note: { type: String, default: ''},
        listProduct: {type: Array, required: true},
        isCheck: { type: Boolean, default: false, required: true },
        isShipping: { type: Boolean, default: false, required: true },
        isDone: { type: Boolean, default: false, required: true },
        isCancel: { type: Boolean, default: false, required: true },
        status: { type: String, default: 'active', required: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('orders_tbls', orderSchame.index({'$**': 'text'}));
