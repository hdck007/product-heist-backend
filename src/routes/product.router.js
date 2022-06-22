const router = require('express').Router();
const {
  addItems, removeItems,
  getItems,
} = require('../controllers/product.controller');

router.get('/', getItems);
router.post('/add', addItems);
router.delete('/remove', removeItems);

module.exports = router;
