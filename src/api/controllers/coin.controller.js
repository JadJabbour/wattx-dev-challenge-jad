const Coin = require('../models/coin.model');

exports.list = async (req, res, next) => {
	try{
		var limit = 200;

		if(req.query.hasOwnProperty('limit') && Number.isInteger(req.query.limit) && req.query.limit < 200){
			limit = parseInt(req.query.limit);
		}

		const coins = await Coin.list(limit);
		res.json(coins);
	}
	catch(error){
		next(error);
	}
}