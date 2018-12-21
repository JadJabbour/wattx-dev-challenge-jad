const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');

/**
 * Coin Schema
 * @private
 */
const coinSchema = new mongoose.Schema({
  _id: {
    type: Number,
  },
  name: {
    type: String,
    maxlength: 128,
    trim: true,
  },
  symbol: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  slug: {
    type: String,
    maxlength: 128,
    trim: true,
  },
  cmc_rank:{
    type: Number, 
  },
  cmc_last_updated: {
    type: Date
  }, 
  ccp_last_updated: {
    type: Date
  }, 
  usd_price: {
    type: Number
  },  
  open_day: {
    type: Number
  },  
  low_day: {
    type: Number
  }, 
  high_day: {
    type: Number
  },    
}, {
  timestamps: true,
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
coinSchema.pre('save', async function save(next) {
  try {
    return this.isModified('cmc_last_updated') || this.isModified('ccp_last_updated') ? next() : null;
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
coinSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'symbol', 'slug', 'open_day', 'low_day', 'high_day'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

/**
 * Statics
 */
coinSchema.statics = {

  /**
   * Get coin
   *
   * @param {ObjectId} id - The objectId of coin.
   * @returns {Promise<Coin, APIError>}
   */
  async get(id) {
    try {
      let coin;

      coin = await this.findById(id).exec();
      
      if (coin) {
        return coin;
      }

      throw new APIError({
        message: 'Coin does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  async getBySymbol(symbol) {
    try {
      let coin;

      coin = await this.findOne({ 'symbol' : symbol}).exec();
      
      if (coin) {
        return coin;
      }

      throw new APIError({
        message: 'Coin does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * List coins by cmc rank ascending
   *
   * @param {number} limit - Limit number of coins to be returned.
   * @returns {Promise<Coin[]>}
   */
  list(limit) {
    return this.find()
      .sort({ cmc_rank: 1 })
      .limit(limit)
      .exec();
  }

};

/**
 * @typedef User
 */
module.exports = mongoose.model('Coin', coinSchema);
