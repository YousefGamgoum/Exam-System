const productModel = require("../models/product");
const { catchAsync } = require("../utils/catchAsync");

exports.getAllProduct = catchAsync(async (req, res, next) => {
  let products = await productModel.find().populate("seller");

  res.status(200).json({ message: "success", data: products });
});

// create
exports.createProduct = catchAsync(async (req, res, next) => {
  let newProduct = req.body;

  if (req.file) {
    newProduct.photo = `/uploads/${req.file.filename}`;
  }

  let product = await productModel.create({ ...newProduct, seller: req.id });
  
  return res.status(200).json({
    message: "success",
    data: product,
  });
});
