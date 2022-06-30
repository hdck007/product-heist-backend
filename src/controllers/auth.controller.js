const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' }); // Unauthorized
    // evaluate password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // create JWTs
      const accessToken = jwt.sign(
        {
          username: user.username,
          id: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' },
      );
      const refreshToken = jwt.sign(
        {
          username: user.username,
          id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' },
      );
      await prisma.user.update({
        where: {
          username,
        },
        data: {
          refresh: refreshToken,
        },
      });
      res.status(200).json({ accessToken, refreshToken });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    res.status(500).json({ message: 'error logging in' });
  }
};

const handleRegister = async (req, res) => {
  try {
    const {
      username, password, firstName, lastName,
    } = req.body;
    if (!username || !password || !firstName || !lastName) res.status(400).json({ message: 'missing required fields' });
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (user) {
      res.status(400).json({ message: 'Username already exists' });
    }
    const userId = `${username}-id`;
    const accessToken = jwt.sign(
      { username, id: userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' },
    );
    const refreshToken = jwt.sign(
      { username, id: userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' },
    );
    await prisma.user.create({
      data: {
        id: userId,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        refresh: refreshToken,
      },
    });
    res.status(201).json({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error creating user' });
  }
};

const handleLogout = async (req, res) => {
  try {
    const { cookies } = req;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    await prisma.user.update({
      where: {
        refresh: refreshToken,
      },
      data: {
        refresh: null,
      },
    });
    res.status(204).json({ msg: 'logged out' });
  } catch {
    res.status(500).json({ message: 'error logging out' });
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  handleLogout,
};
