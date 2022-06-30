const router = require('express').Router();
const {
  addItems, removeItems,
  getItems,
  shouldNotify,
} = require('../controllers/product.controller');

router.get('/', getItems);
router.get('/notification/meta', shouldNotify);
router.post('/add', addItems);
router.delete('/remove', removeItems);

module.exports = router;
