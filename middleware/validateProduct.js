const { z } = require('zod');

const productSchema = z.object({
    productName: z.string(),
    sku: z.string(),
    category: z.string(),
    price: z.number(),
    cost: z.number(),
    stockQuantity: z.number().min(0),
    reorderLevel: z.number()
});

const validatedSchema = productSchema.refine(
  (data) => data.price >= data.cost,
  {
    message: 'Price cannot be lower than cost',
    path: ['price']
  }
);

const validateProduct = (req, res, next) => {
  const result = validatedSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  next();
};

module.exports = validateProduct;