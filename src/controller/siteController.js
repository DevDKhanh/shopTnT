require('dotenv').config();
const dbProduct = require('./model/product');
const { mutipleMongooseToObject } = require('../util/mongoose');
const { mongooseToObject } = require('../util/mongoose');
const { Socket } = require('../middlewares/socketO');
const webPush = require('web-push');
const fech = require('node-fetch');
webPush.setVapidDetails(
	'mailto:example@yourdomain.org',
	process.env.PULIC_KEY_PUSH,
	process.env.PRIVATE_KEY_PUSH,
);
let pushsciption;

class SiteController {
	index(req, res) {
		const title = 'Trang chủ';
		console.log(req.session);
		res.render('home', { title, pagehome: true });
	}

	async fmc(req, res, next) {
		res.status(200).json('Hallo');

		pushsciption = req.body;
		const msg = JSON.stringify({
			title: 'New Msg',
			text: 'Bạn có đơn hàng mới',
		});
		console.log(req.body);
		webPush
			.sendNotification(pushsciption, msg)
			.catch(err => console.lof(err));
	}

	logout(req, res) {
		req.logout();
		req.session.destroy(function (err) {
			return res.redirect('/');
		});
	}

	seemorePrd(req, res, next) {
		dbProduct
			.findOne({ slug: req.params.slug, status: 'active' })
			.then(data => {
				if (data) {
					const title = `Chi tiết sản phẩm ${data.productname}`;
					res.render('product/seemore', {
						title,
						data: mongooseToObject(data),
					});
				} else {
					res.redirect('/danhmuc/Tất%20cả%20sản%20phẩm');
				}
			})
			.catch(next);
	}

	search(req, res, next) {
		const key = req.query.key;
		let title = 'Tìm kiếm';
		dbProduct
			.find({ status: 'active', $text: { $search: '' + key + '' } })
			.sort({ createdAt: -1 })
			.then(data => {
				dbProduct
					.countDocuments({
						status: 'active',
						$text: { $search: '' + key + '' },
					})
					.then(num => {
						if (num > 0) {
							title = 'Kết quả tìm kiếm: ' + key;
						} else {
							title = 'Không tìm thấy nội dung yêu cầu';
						}
						res.render('product/search', {
							title,
							data: mutipleMongooseToObject(data),
							num,
						});
					});
			})
			.catch(err => res.send('Có lỗi xảy ra!'));
	}

	danhmuc(req, res, next) {
		const key = req.params.name;
		const title = `Danh mục ${key}`;
		let options = { classify: key };
		if (key == 'Tất cả sản phẩm') {
			options = { status: 'active' };
		}
		dbProduct
			.find(options)
			.sort({ createdAt: -1 })
			.then(data => {
				if (data.length > 0) {
					return data;
				} else {
					return dbProduct.find();
				}
			})
			.then(product =>
				res.render('classify', {
					title,
					product: mutipleMongooseToObject(product),
				}),
			)
			.catch(err => res.send('Có lỗi xảy ra vui lòng thử lại!'));
	}

	page404(req, res) {
		res.status(404).redirect('/');
	}
}

module.exports = new SiteController();
