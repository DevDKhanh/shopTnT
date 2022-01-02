require('dotenv').config();
let dev = process.env.DEV == 'true';
module.exports = {
    'facebook_key': process.env.KEY_FB,
    'facebook_secret': process.env.SECRET_FB,
    'callback_url': dev ? process.env.DOMAIN_FB : process.env.DOMAIN_FB_WEB ,
    'google_key': process.env.KEY_GG, 
    'google_secret': process.env.SECRET_GG, 
    'gg_callback_url': dev ? process.env.DOMAIN_GG : process.env.DOMAIN_GG_WEB,
}