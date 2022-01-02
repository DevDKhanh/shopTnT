const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Schema = mongoose.Schema;
const productSchame = new Schema(
    {
        productname: { type: String, required: true },
        slug: { type: String, slug: 'productname', unique: true },
        available: { type: String, default: 0, required: true },
        price: { type: String, required: true },
        classify: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        idImg: {type: String, require: true},
        tradeMark: { type: String, required: true },
        star: { type: Number, default: 0, required: true },
        bought: { type: Number, default: 0, required: true },
        productWarranty: {
            type: String,
            default: 'Không có bảo hành!',
            required: true,
        },
        status: { type: String, default: 'active', required: true },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('product_tbls', productSchame.index({'$**': 'text'}));
