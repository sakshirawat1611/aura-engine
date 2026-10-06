require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Product = require('./models/Product');

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding');
  const products = [];
  for (let i = 0; i < 50000; i++) {
    products.push({
        productName: faker.commerce.productName(),
        sku: faker.string.uuid(),
        category: faker.commerce.department(),
        price: faker.number.int({ min: 100, max: 5000 }),
        cost: faker.number.int({ min: 50, max: 4000 }),
        stockQuantity: faker.number.int({ min: 0, max: 1000 }),
        reorderLevel: faker.number.int({ min: 10, max: 100 })
});
}

try {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('50,000 products inserted');
} catch (err) {
  console.error('Seeding error:', err.message);
}

await mongoose.disconnect();

};

seedDB();