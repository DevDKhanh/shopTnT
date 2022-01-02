const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({ 
    cloud_name: process.env.NAME_CLOUDINARY, 
    api_key: process.env.API_CLOUDINARY, 
    api_secret: process.env.KEY_CLOUDINARY
});

module.exports = cloudinary;