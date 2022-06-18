const router = require('express').Router();
const { getItems } = require('../controllers/amazonItems.controller');

router.get('/:query', getItems);

module.exports = router;
