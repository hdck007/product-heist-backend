const { handleRegister, handleLogin, handleLogout } = require('../controllers/auth.controller');

const router = require('express').Router();

router.post('/login', handleLogin);
router.post('/register', handleRegister);
router.get('/logout', handleLogout);

module.exports = router;