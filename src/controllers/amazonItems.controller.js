const { scrapeData } = require('../services/amazonItems.service');

async function getItems(req, res, next) {
  try {
    const results = await scrapeData(
      `https://www.amazon.in/s?k=${req.params.query}`,
    );
    res.status(200).json(results);
  } catch (err) {
    console.error('Error while getting programming languages', err.message);
    next(err);
  }
}

module.exports = {
  getItems,
};
