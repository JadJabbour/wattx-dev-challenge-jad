const Coin = require('../models/coin.model');
const { omit } = require('lodash');
const rp = require('request-promise');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const requestOptionsCMC = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    start: 1,
    limit: 200,
    convert: 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': 'b52c389c-fd6d-4de7-9211-56ff805ac88c'
  },
  json: true,
  gzip: true
};

const requestOptionsCCP = {
  method: 'GET',
  uri: 'https://min-api.cryptocompare.com/data/top/totalvolfull',
  qs: {
    api_key: '0d450e4d6c715637660cc5bf8b00a9a5aac4f7e186dfddc0ee5a16cfb8f8bef1',
    limit: 100,
    tsym: 'USD'
  },
  json: true,	
  gzip: true
};

var updateOrAddToken = async (id, data, source) => {
	try{
		let coin = source == "cmc" ? await Coin.get(id) : await Coin.getBySymbol(id);
		const newCoin = new Coin(data);
		const newCoinObject = Object.assign({}, omit(coin.toObject(), '_id'), omit(newCoin.toObject(), '_id'));

		await coin.update(newCoinObject, { override: true, upsert: true });

    	return await Coin.findById(coin._id);
	}
	catch(error){
		if(error.status == httpStatus.NOT_FOUND && source != 'ccp'){
			return await new Coin(Object.assign({}, {_id: id}, data)).save().then(()=>console.log('created'));
		}
		
		throw error
	}
}
 
exports.pullCMC = () => {
	return rp(requestOptionsCMC).then(response => {
		for (var i = 0; i < response.data.length; i++) {
			updateOrAddToken(response.data[i].id, {
				name: response.data[i].name, 
				symbol: response.data[i].symbol,
				slug: response.data[i].slug,
				cmc_last_updated: response.data[i].last_updated,
				cmc_rank: response.data[i].cmc_rank,
				usd_price: response.data[i].quote.USD.price
			}, 'cmc');
		}
	}).catch((err) => {
	  console.log('API call error:', err.message);
	});
}

exports.pullCCP = () => {
	return rp(requestOptionsCCP).then(response => {
		for (var i = 0; i < response.Data.length; i++) {
			updateOrAddToken(response.Data[i].CoinInfo.Name, {
				ccp_last_updated: response.Data[i].RAW.USD.LASTUPDATE,
				open_day: response.Data[i].RAW.USD.OPENDAY,
				high_day: response.Data[i].RAW.USD.HIGHDAY,
				low_day: response.Data[i].RAW.USD.LOWDAY
			}, 'ccp');
		}
	}).catch(err => {
	  console.log('API call error:', err.message);
	});
}