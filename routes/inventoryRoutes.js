const express = require('express');
const router = express.Router();
const { getInventory, createProduct, updateProduct } = require('../controllers/inventoryController');
const validateProduct = require('../middleware/validateProduct');

router.get('/', getInventory);
router.post('/', validateProduct, createProduct);
router.put('/:id', validateProduct, updateProduct);

module.exports = router;