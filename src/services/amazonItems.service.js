const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function scrapeData(url) {
  // const proxies_list = [
  //  '128.199.109.241:8080',
  //  '113.53.230.195:3128',
  //  '125.141.200.53:80',
  //  '125.141.200.14:80',
  //  '128.199.200.112:138',
  //  '149.56.123.99:3128',
  //  '128.199.200.112:80',
  //  '125.141.200.39:80',
  //  '134.213.29.202:4444',
  // ];
  // const proxyAgent = new HttpsProxyAgent(`https://51.81.80.44:80`);

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
    const image = section('.s-image').attr('src');
    if (title.trim() && price.trim() && ratings.trim() && image) {
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
