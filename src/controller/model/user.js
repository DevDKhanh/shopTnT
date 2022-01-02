const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchame = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, default: '' },
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        name: { type: String, default: '' },
        gender: { type: String, default: '' },
        avatar: { type: String, default: '' },
        birth: { type: String, default: '' },
        datechange: { type: String, default: '' },
        address: { type: String, default: '' },
        paid: { type: Number, default: 0 },
        isBlock: { type: Boolean, default: false },
        isAdmin: { type: Boolean, default: false },
        wallet: { type: Number, default: 0 },
        phone: { type: String },
        password: { type: String },
        provider: { type: String, default:'shopTnT'},
        socialId: { type: String, default: ''},
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('users_tbls', userSchame.index({'$**': 'text'}));
