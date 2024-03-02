const CategoryModel = require('../models/CategoryModel')
const mongoose = require("mongoose");

// Create a category
const create = async (req, res) => {
      try {
            const { name } = req.body
            const categoryExist = Boolean(await CategoryModel.findOne({ name }))

            if (!categoryExist) {
                  const category = await CategoryModel.create(req.body)

                  return res.status(201).send(
                        {
                              status: true,
                              message: "Category created successfully!",
                              category
                        })
            }
            else {
                  return res.status(409).send({
                        status: false,
                        message: `Category exist with ${name}`
                  })
            }

      }
      catch (err) {
            res.send({
                  status: false,
                  message: `${err}`
            })
      }
}

// GET all categories
const categories = async (req, res) => {
      try {
            await search(req, res, '')
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// GET category by Id
const category = async (req, res) => {

      const { id } = req.params

      try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `Category Id Incorrect`
                  })
            }

            const foundCategory = await CategoryModel.findById(id)

            if (!foundCategory) {
                  return res.status(404).json({
                        status: false,
                        message: `Category not found`,
                  });
            }

            res.status(200).json({
                  status: true,
                  category: foundCategory
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const search = async (req, res, status) => {

      let filter = {
            isDeleted: false,
            status
      };

      if (status === '') {
            filter = {
                  isDeleted: false
            };
      }
      if (req.query.filterBy && req.query.value) {
            filter[req.query.filterBy] = req.query.value;
      }

      const pageSize = +req.query.pageSize || 10;
      const currentPage = +req.query.currentPage || 1;
      const sortBy = req.query.sortBy || '_id'; // _id or description or code or po or etc.
      const sortOrder = req.query.sortOrder || 'desc'; // asc or desc

      const totalItems = await CategoryModel.find(filter).countDocuments();
      const items = await CategoryModel.find(filter)
            .skip((pageSize * (currentPage - 1)))
            .limit(pageSize)
            .sort({ [sortBy]: sortOrder })

      const responseObject = {
            status: true,
            message: "Category fetched Successfully",
            totalPages: Math.ceil(totalItems / pageSize),
            totalItems,
            categories: items
      }

      if (items.length) {
            return res.status(200).json(responseObject);
      }

      else {
            return res.status(401).json({
                  status: false,
                  message: "Nothing found",
                  categories: items
            });
      }
}

// Update category by Id
const update = async (req, res) => {

      const { id } = req.params
      let categoryDetails = {}

      try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `Category Id incorrect`
                  })
            }

            const category = await CategoryModel.findById(id)
            const categoryExist = Boolean(category)

            if (!categoryExist) {
                  return res.status(401).json({
                        status: false,
                        message: `Category doesn't exist`,
                  });
            }

            else {
                  categoryDetails = {
                        ...req.body,
                        updatedAt: new Date()
                  }
            }

            const updatedCategory = await CategoryModel.findByIdAndUpdate
                  (
                        id, categoryDetails,
                        {
                              new: true,
                              runValidators: true
                        }
                  )

            res.status(201).json({
                  status: true,
                  message: "Category updated successfully",
                  category: updatedCategory
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

module.exports = {
      create,
      categories,
      category,
      update
}