const router = require('express').Router();
const { handleRegister, handleLogin, handleLogout } = require('../controllers/auth.controller');

router.post('/login', handleLogin);
router.post('/register', handleRegister);
router.get('/logout', handleLogout);

module.exports = router;
