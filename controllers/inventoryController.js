
const Product = require('../models/Product');

const getInventory = async (req, res) => {
  try {
    // pagination setup
    const page = parseInt(req.query.page) || 1;     // current page, default 1
    const limit = parseInt(req.query.limit) || 50;  // items per page, default 50
    const skip = (page - 1) * limit;                // how many docs to skip

    // filtering setup
    const filter = {};

    if (req.query.search) {
      // search by productName using regex for partial matches, case-insensitive
      filter.productName = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    // sorting setup
    //
    let sortBy = {};
    if (req.query.sort) {
      const field = req.query.sort.replace('-', '');
      const order = req.query.sort.startsWith('-') ? -1 : 1;
      sortBy[field] = order;
    }

    // query the database 
    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    // total matching records for pagination information
    const totalRecords = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit);

    // sending response with products and pagination information
    res.json({
      totalRecords,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      products
    });

  } catch (err) {
    // if anything above fails, return a clean error instead of crashing
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getInventory, createProduct, updateProduct };