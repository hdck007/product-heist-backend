const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeData(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const listItems = $('._1AtVbE');
  const items = [];
  listItems.each((i, el) => {
    const section = cheerio.load($(el).html());
    const title = section('._4rR01T').text();
    const price = section('._30jeq3').text();
    const ratings = section('._3LWZlK').text();
    const image = section('._396cs4').attr('src');
    if (title.trim() && price.trim()) {
      items.push({
        title,
        price,
        ratings,
        image,
      });
    }
  });
  return items;
}

module.exports = {
  scrapeData,
};
