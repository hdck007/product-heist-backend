const router = require('express').Router();
const { getItems } = require('../controllers/flipkartItems.controller');

router.get('/:query', getItems);

module.exports = router;
