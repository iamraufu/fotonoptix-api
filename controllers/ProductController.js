const CategoryModel = require('../models/CategoryModel')
const SubcategoryModel = require('../models/SubcategoryModel')
const ProductModel = require('../models/ProductModel')
const mongoose = require("mongoose")

// Create a product
const create = async (req, res) => {
      try {
            const { name, category, subcategory } = req.body
            const productExist = Boolean(await ProductModel.findOne({ name }))

            if (productExist) {
                  return res.status(409).send({
                        status: false,
                        message: `Product exist with ${name}`
                  })
            }

            const categoryExist = Boolean(await CategoryModel.findById(category))
            const subcategoryExist = Boolean(await SubcategoryModel.findById(subcategory))

            if (!categoryExist) {
                  return res.status(404).send({
                        status: false,
                        message: `Category doesn't exist with ${category}`
                  })
            }

            if (!subcategoryExist) {
                  return res.status(404).send({
                        status: false,
                        message: `Subcategory doesn't exist with ${subcategory}`
                  })
            }

            if (!mongoose.Types.ObjectId.isValid(category)) {
                  return res.status(404).json({
                        status: false,
                        message: `Category Id Incorrect`
                  })
            }

            if (!mongoose.Types.ObjectId.isValid(subcategory)) {
                  return res.status(404).json({
                        status: false,
                        message: `Subcategory Id Incorrect`
                  })
            }

            if (!productExist) {
                  const product = await ProductModel.create(req.body)
                  console.log(product);

                  return res.status(201).send({
                        status: true,
                        message: "Product created successfully",
                        product
                  })
            }
      }
      catch (err) {
            console.log(err);
            res.send({
                  status: false,
                  message: `${err}`
            })
      }
}

// GET all products
const products = async (req, res) => {
      try {
            await search(req, res)
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const search = async (req, res) => {

      let filter = {
            isDeleted: false
      };

      if (req.query.filterBy && req.query.value) {
            filter[req.query.filterBy] = req.query.value;
      }

      const pageSize = +req.query.pageSize || 10;
      const currentPage = +req.query.currentPage || 1;
      const sortBy = req.query.sortBy || '_id';
      const sortOrder = req.query.sortOrder || 'desc'; // asc or desc

      const totalItems = await ProductModel.find(filter).countDocuments();
      const items = await ProductModel.find(filter)
            .skip((pageSize * (currentPage - 1)))
            .limit(pageSize)
            .sort({ [sortBy]: sortOrder })
            .lean()
            .populate(
                  {
                        path: 'category',
                        select: " -_id name banner"
                  }
            )
            .populate(
                  {
                        path: 'subcategory',
                        select: " -_id name image"
                  }
            )

      if (!items.length) {
            return res.status(404).json({
                  status: false,
                  message: "Nothing found",
                  products: items
            });
      }

      const responseObject = {
            status: true,
            message: "Products fetched Successfully",
            totalPages: Math.ceil(totalItems / pageSize),
            totalItems,
            products: items
      }

      if (items.length) {
            return res.status(200).json(responseObject);
      }
}

// GET product by Id
const product = async (req, res) => {

      const { id } = req.params

      try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `Product Id Incorrect`
                  })
            }

            const foundProduct = await ProductModel.findById(id).populate(
                  {
                        path: 'category',
                        select: " -_id name banner"
                  }
            ).populate(
                  {
                        path: 'subcategory',
                        select: " -_id name image"
                  }
            )

            if (!foundProduct) {
                  return res.status(404).json({
                        status: false,
                        message: `Product not found`,
                  });
            }

            res.status(200).json({
                  status: true,
                  product: foundProduct
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// Update Product by Id
const update = async (req, res) => {

      const { id } = req.params
      let productDetails = {}

      try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `Product Id incorrect`
                  })
            }

            const product = await ProductModel.findById(id)
            const productExist = Boolean(product)

            if (!productExist) {
                  return res.status(401).json({
                        status: false,
                        message: `Product doesn't exist`,
                  });
            }

            else {
                  productDetails = {
                        ...req.body,
                        updatedAt: new Date()
                  }
            }

            const updatedProduct = await ProductModel.findByIdAndUpdate
                  (
                        id, productDetails,
                        {
                              new: true,
                              runValidators: true
                        }
                  ).populate(
                        {
                              path: 'category',
                              select: " -_id name banner"
                        }
                  ).populate(
                        {
                              path: 'subcategory',
                              select: " -_id name image"
                        }
                  )

            res.status(201).json({
                  status: true,
                  message: "Product updated successfully",
                  product: updatedProduct
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const searchProduct = async (req, res) => {
      try {
            const { name } = req.query
            const products = await ProductModel.find({ name: { $regex: name, $options: 'i' } }
            ).populate(
                  {
                        path: 'category',
                        select: " -_id name banner"
                  }
            ).populate(
                  {
                        path: 'subcategory',
                        select: " -_id name image"
                  }
            )

            if (!products.length > 0) {
                  return res.status(404).json({
                        status: false,
                        message: "No products found",
                        products
                  })
            }

            else {
                  res.status(200).json({
                        status: true,
                        message: "Products fetched Successfully",
                        products
                  })
            }
      }
      catch (err) {

      }
}

module.exports = {
      create,
      products,
      product,
      update,
      searchProduct
}