const router = require('express').Router();
const { handleRefreshToken } = require('../controllers/refresh.controller');

router.get('/', handleRefreshToken);

module.exports = router;
