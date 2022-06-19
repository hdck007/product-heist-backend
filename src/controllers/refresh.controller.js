const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const handleRefreshToken = (req, res) => {
  try {
    const { cookies } = req;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = prisma.user.findFirst({
      where: {
        refresh: refreshToken,
      },
    });
    if (!foundUser) return res.sendStatus(403); // Forbidden
    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
        const accessToken = jwt.sign(
          { username: decoded.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '30s' },
        );
        res.json({ accessToken });
      },
    );
  } catch {
    res.status(500).json({ msg: 'error refreshing token' });
  }
};

module.exports = { handleRefreshToken };
