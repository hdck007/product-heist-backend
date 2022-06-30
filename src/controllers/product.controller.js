const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
require('dotenv').config();

const getItems = async (req, res) => {
  try {
    const data = await prisma.product.findMany({
      where: {
        customers: {
          some: {
            customer: {
              id: req.user,
            },
          },
        },
      },
    });
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

const addItems = async (req, res) => {
  try {
    const {
      url,
      imageUrl,
      title,
      price,
      ratings,
      brand,
    } = req.body;
    const product = await prisma.product.findUnique({
      where: {
        title,
      },
    });

    if (product) {
      await prisma.product.update({
        where: {
          id: product.id,
        },
        data: {
          customers: {
            create: {
              customer: {
                connect: {
                  id: req.user,
                },
              },
            },
          },
        },
      });
    } else {
      await prisma.product.create({
        data: {
          url,
          imageUrl,
          title,
          price,
          ratings,
          brand,
          customers: {
            create: {
              customer: {
                connect: {
                  id: req.user,
                },
              },
            },
          },
        },
      });
    }
    res.status(201).json({ msg: 'product added sucessfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

const removeItems = async (req, res) => {
  try {
    const {
      id,
    } = req.body;

    await prisma.userWatchedProducts.delete({
      where: {
        customerId_productId: {
          customerId: req.user,
          productId: id,
        },
      },
    });
    res.status(200).json({ msg: 'product removed successfully' });
  } catch {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = {
  getItems,
  addItems,
  removeItems,
};
