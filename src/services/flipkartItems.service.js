const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function scrapeData(url) {
  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);
  const listItems = $('._1AtVbE');
  const items = [];
  listItems.each((i, el) => {
    const section = cheerio.load($(el).html());
    const title = section('._4rR01T').text();
    const price = section('._30jeq3').text();
    const ratings = section('._3LWZlK').text();
    const productUrl = section('._1fQZEK').attr('href');
    const imageUrl = section('._396cs4').attr('src');
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
        url: `https://www.flipkart.com${productUrl}`,
        brand: 'flipkart',
      });
    }
  });
  return items;
}

async function getFplikartItemPrice(url) {
  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    const price = $('._30jeq3._16Jk6d').text().split('₹')[1];
    return price;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = {
  scrapeData,
  getFplikartItemPrice,
};
