const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get admin dashboard metrics & analytics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // Sales calculations
    const salesData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          avgOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    const totalRevenue = salesData.length > 0 ? salesData[0].totalRevenue : 0;
    const avgOrderValue = salesData.length > 0 ? salesData[0].avgOrderValue : 0;

    // Low stock products (totalStock <= 15)
    const lowStockProducts = await Product.find({ totalStock: { $lte: 15 } })
      .select('name slug totalStock price images category')
      .populate('category', 'name');

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Sales by category aggregation
    const categorySales = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDoc'
        }
      },
      { $unwind: '$productDoc' },
      {
        $lookup: {
          from: 'categories',
          localField: 'productDoc.category',
          foreignField: '_id',
          as: 'categoryDoc'
        }
      },
      { $unwind: '$categoryDoc' },
      {
        $group: {
          _id: '$categoryDoc.name',
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalUnits: { $sum: '$items.quantity' }
        }
      }
    ]);

    res.json({
      totalRevenue,
      avgOrderValue,
      totalCustomers,
      totalProducts,
      totalOrders,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders,
      categorySales
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer list (Admin)
// @route   GET /api/admin/customers
// @access  Private/Admin
const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getCustomers
};
