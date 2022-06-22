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
              username: req.user,
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
    } = req.body;
    const product = await prisma.product.findUnique({
      where: {
        title,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        username: req.user,
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
                  id: user.id,
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
          customers: {
            create: {
              customer: {
                connect: {
                  id: user.id,
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
    const user = await prisma.user.findUnique({
      where: {
        username: req.user,
      },
    });

    if (!user) return res.status(500).json({ msg: 'Internal server error' });
    await prisma.userWatchedProducts.delete({
      where: {
        customerId_productId: {
          customerId: user.id,
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
