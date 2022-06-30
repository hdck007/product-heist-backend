const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { getAmazonItemPrice } = require('../src/services/amazonItems.service');
const { getFplikartItemPrice } = require('../src/services/flipkartItems.service');

const prisma = new PrismaClient();

module.exports = () => {
  cron.schedule('* * * * *', async () => {
    try {
      // get all the products
      const products = await prisma.product.findMany();

      // loop through products
      for (let i = 0; i < products.length; i += 1) {
        // get the product
        const { url, brand } = products[i];
        // get the price
        let price;
        if (brand === 'flipkart') {
          price = await getFplikartItemPrice(url);
        } else {
          price = await getAmazonItemPrice(url);
        }
        // update the product
        if (price) {
          if (Number(price) < Number(products[i].price)) {
            await prisma.product.update({
              where: {
                id: products[i].id,
              },
              data: {
                price,
                downInCost: true,
              },
            });
          } else {
            await prisma.product.update({
              where: {
                id: products[i].id,
              },
              data: {
                price,
                downInCost: false,
              },
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};
