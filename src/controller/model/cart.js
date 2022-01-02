const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchame = new Schema(
    {
        idUser: { type: String, required: true },
        idProduct: { type: String, required: true },
        nameUser: { type: String, required: true },
        nameProduct: { type: String, required: true },
        quantity: { type: Number, default: 1, required: true },
        price: { type: Number, required: true },
        bought: { type: Number, required: true },
        img: { type: String, required: true },
        slug: { type: String, required: true },
        status: { type: String, default: 'active', required: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('carts_tbls', cartSchame.index({'$**': 'text'}));
