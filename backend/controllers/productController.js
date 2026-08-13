const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Fetch products with filters, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const query = { isActive: true };

    // Search term
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Category filter (slug or ID)
    if (req.query.category) {
      const categoryDoc = await Category.findOne({
        $or: [{ _id: req.query.category.match(/^[0-9a-fA-F]{24}$/) ? req.query.category : null }, { slug: req.query.category }]
      });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Limited edition filter
    if (req.query.isLimitedEdition !== undefined) {
      query.isLimitedEdition = req.query.isLimitedEdition === 'true';
    }

    // Size filter
    if (req.query.size) {
      query['sizes.size'] = req.query.size.toUpperCase();
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sortOptions = { price: 1 };
    else if (req.query.sort === 'price-desc') sortOptions = { price: -1 };
    else if (req.query.sort === 'rating') sortOptions = { rating: -1 };
    else if (req.query.sort === 'oldest') sortOptions = { createdAt: 1 };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by slug or ID
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res, next) => {
  try {
    const isId = req.params.slug.match(/^[0-9a-fA-F]{24}$/);
    const product = await Product.findOne({
      $or: [
        { slug: req.params.slug },
        ...(isId ? [{ _id: req.params.slug }] : [])
      ]
    }).populate('category', 'name slug description');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      compareAtPrice,
      category,
      images,
      sizes,
      colorway,
      isLimitedEdition,
      dropDate,
      tags
    } = req.body;

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const product = new Product({
      name,
      slug: generatedSlug,
      description,
      price,
      compareAtPrice: compareAtPrice || 0,
      category,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop'],
      sizes: sizes || [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 10 },
        { size: 'XL', stock: 5 }
      ],
      colorway: colorway || 'Obsidian Black / Blood Crimson',
      isLimitedEdition: isLimitedEdition || false,
      dropDate: dropDate || null,
      tags: tags || ['Gothic', 'Streetwear', 'XO']
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name || product.name;
      product.slug = req.body.slug || product.slug;
      product.description = req.body.description || product.description;
      product.price = req.body.price !== undefined ? req.body.price : product.price;
      product.compareAtPrice = req.body.compareAtPrice !== undefined ? req.body.compareAtPrice : product.compareAtPrice;
      product.category = req.body.category || product.category;
      if (req.body.images) product.images = req.body.images;
      if (req.body.sizes) product.sizes = req.body.sizes;
      product.colorway = req.body.colorway || product.colorway;
      product.isLimitedEdition = req.body.isLimitedEdition !== undefined ? req.body.isLimitedEdition : product.isLimitedEdition;
      product.dropDate = req.body.dropDate || product.dropDate;
      if (req.body.tags) product.tags = req.body.tags;
      if (req.body.isActive !== undefined) product.isActive = req.body.isActive;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
