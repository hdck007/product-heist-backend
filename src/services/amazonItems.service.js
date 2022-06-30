const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function scrapeData(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
    },
  });
  const body = await response.text();
  const $ = cheerio.load(body);
  const listItems = $('.s-result-item');
  const items = [];
  listItems.each((i, el) => {
    const section = cheerio.load($(el).html());
    const title = section('.a-size-medium').text();
    const price = section('.a-price-whole').text();
    const ratings = section('.a-icon-alt').text();
    const productUrl = section('.a-link-normal.s-no-outline').attr('href');
    const imageUrl = section('.s-image').attr('src');
    if (title.trim()
    && price.trim()
    && ratings.trim()
    && imageUrl
    && productUrl) {
      items.push({
        title,
        price,
        ratings,
        imageUrl,
        url: `https://www.amazon.in${productUrl}`,
        brand: 'amazon',
      });
    }
  });
  return items;
}

async function getAmazonItemPrice(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
      },
    });
    const body = await response.text();
    const $ = cheerio.load(body);
    const price = $('.a-price-whole').text().split('.')[0];
    return price;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  scrapeData,
  getAmazonItemPrice,
};
