const { scrapeData } = require('../services/flipkartItems.service');

async function getItems(req, res, next) {
  try {
    const results = await scrapeData(
      `https://www.flipkart.com/search?q=${req.params.query}`,
    );
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getItems,
};
