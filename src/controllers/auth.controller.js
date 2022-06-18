const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) return res.status(401); // Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' },
    );
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' },
    );
    res.json({ accessToken, refreshToken });
  } else {
    res.sendStatus(401);
  }
};

const handleRegister = async (req, res) => {
  const {
    username, password, firstName, lastName,
  } = req.body;
  if (!username || !password || !firstName || !lastName) res.status(400).json({ message: 'missing required fields' });
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  // const hashedPassword = await bcrypt.hash(password, 10);
  if (user) {
    res.status(400).json({ message: 'Username already exists' });
  }
  // const createdUser = await prisma.user.create({
  //   data: {
  //     username,
  //     password: hashedPassword,
  //     firstName,
  //     lastName,
  //   },
  // });
};

// const handleLogout = (req, res, next) => {

// };

module.exports = {
  handleLogin,
  handleRegister,
  // handleLogout,
};
