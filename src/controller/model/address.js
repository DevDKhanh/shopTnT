const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addrSchame = new Schema(
    {
        idUser: { type: String, default: '',required: true },
        addr: { type: String, default: '',required: true },
        nameOrder: { type: String, default: '',required: true },
        phone: { type: String, default: '', required: true },
        isDefault: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('addr_tbls', addrSchame.index({'$**': 'text'}));
