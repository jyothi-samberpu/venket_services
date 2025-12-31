const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const path = require('path');
const multer = require('multer');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/**
 * @desc   Add new product
 * @route  POST /product/add
 */
const addProduct = async (req, res) => {
  try {
    const { name, price, description, category, vendor } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      vendor,
      image: req.file ? req.file.path : null
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc   Get all products
 * @route  GET /product/all
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('vendor')
      .populate('category');

    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc   Get single product by ID
 * @route  GET /product/:id
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor')
      .populate('category');

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @desc   Delete product
 * @route  DELETE /product/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  upload // export multer upload to use in router
};
