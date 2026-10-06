// controllers/analyticsController.js
const Product = require('../models/Product');

const getAnalytics = async (req, res) => {
  try {
    const analytics = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalValuation: { $sum: { $multiply: ['$price', '$stockQuantity'] } },
          totalProducts: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalValuation: 1,
          totalProducts: 1
        }
      }
    ]);
res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnalytics };