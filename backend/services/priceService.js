const axios = require('axios');

class PriceService {
  constructor() {
    this.cache = {
      btcPrice: 0,
      lastUpdated: 0,
      cacheTimeout: 30000 // 30 seconds
    };
  }

  async getCurrentBTCPrice() {
    const now = Date.now();
    
    // Return cached price if it's still valid
    if (this.cache.btcPrice > 0 && (now - this.cache.lastUpdated) < this.cache.cacheTimeout) {
      return this.cache.btcPrice;
    }

    try {
      // Try to fetch from CoinGecko API
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin',
            vs_currencies: 'usd',
            include_24hr_change: true
          },
          timeout: 5000
        }
      );

      if (response.data && response.data.bitcoin && response.data.bitcoin.usd) {
        const price = response.data.bitcoin.usd;
        this.cache.btcPrice = price;
        this.cache.lastUpdated = now;
        return price;
      }
    } catch (error) {
      console.error('Error fetching BTC price from CoinGecko:', error.message);
    }

    // Fallback to CoinMarketCap API
    try {
      const response = await axios.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        {
          params: {
            symbol: 'BTC',
            convert: 'USD'
          },
          headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY || 'demo'
          },
          timeout: 5000
        }
      );

      if (response.data && response.data.data && response.data.data.BTC) {
        const price = response.data.data.BTC.quote.USD.price;
        this.cache.btcPrice = price;
        this.cache.lastUpdated = now;
        return price;
      }
    } catch (error) {
      console.error('Error fetching BTC price from CoinMarketCap:', error.message);
    }

    // Fallback to a mock price if all APIs fail
    console.warn('All price APIs failed, using mock price');
    const mockPrice = 45000 + Math.random() * 10000;
    this.cache.btcPrice = mockPrice;
    this.cache.lastUpdated = now;
    return mockPrice;
  }

  async getHistoricalPrices(days = 7) {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: days
          },
          timeout: 5000
        }
      );

      if (response.data && response.data.prices) {
        return response.data.prices.map(([timestamp, price]) => ({
          timestamp: new Date(timestamp),
          price: price
        }));
      }
    } catch (error) {
      console.error('Error fetching historical prices:', error.message);
    }

    return [];
  }

  async getPriceChange24h() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'bitcoin',
            vs_currencies: 'usd',
            include_24hr_change: true,
            include_24hr_vol: true,
            include_market_cap: true
          },
          timeout: 5000
        }
      );

      if (response.data && response.data.bitcoin) {
        return {
          price: response.data.bitcoin.usd,
          change24h: response.data.bitcoin.usd_24h_change,
          volume24h: response.data.bitcoin.usd_24h_vol,
          marketCap: response.data.bitcoin.usd_market_cap
        };
      }
    } catch (error) {
      console.error('Error fetching 24h price change:', error.message);
    }

    return {
      price: this.cache.btcPrice,
      change24h: 0,
      volume24h: 0,
      marketCap: 0
    };
  }
}

module.exports = new PriceService();