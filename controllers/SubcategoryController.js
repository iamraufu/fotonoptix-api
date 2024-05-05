const CategoryModel = require('../models/CategoryModel')
const SubcategoryModel = require('../models/SubcategoryModel')
const mongoose = require("mongoose");

// Create a sub category
const create = async (req, res) => {
      try {
            const { name, categoryId } = req.body
            const subCategoryExist = Boolean(await SubcategoryModel.findOne({ name }))
            const categoryExist = Boolean(await CategoryModel.findById(categoryId))

            if (subCategoryExist) {
                  return res.status(409).send({
                        status: false,
                        message: `Subcategory exist with ${name}`
                  })
            }

            if (!name) {
                  return res.status(404).json({
                        status: false,
                        message: `Category Name Missing`
                  })
            }

            if (!categoryId) {
                  return res.status(404).json({
                        status: false,
                        message: `Category Id Missing`
                  })
            }

            if (!mongoose.Types.ObjectId.isValid(categoryId)) {
                  return res.status(404).json({
                        status: false,
                        message: `Category Id Incorrect`
                  })
            }

            if (!categoryExist) {
                  return res.status(404).send({
                        status: false,
                        message: `Category doesn't exist with ${categoryId}`
                  })
            }

            if (!subCategoryExist) {
                  const subCategory = await SubcategoryModel.create(req.body)

                  return res.status(201).send(
                        {
                              status: true,
                              message: "Subcategory created successfully!",
                              subCategory
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

// GET all subcategories
const subcategories = async (req, res) => {
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

// GET subcategory by Id
const subcategory = async (req, res) => {

      const { id } = req.params

      try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `Subcategory Id Incorrect`
                  })
            }

            let foundSubcategory = await SubcategoryModel.findById(id).lean()
            
            if (!foundSubcategory) {
                  return res.status(404).json({
                        status: false,
                        message: `Subcategory not found`,
                  });
            }
            
            const categoryDetails = await CategoryModel.findById(foundSubcategory.categoryId).select(' -_id name banner');

            foundSubcategory = {
                  ...foundSubcategory,
                  category: categoryDetails
            }

            res.status(200).json({
                  status: true,
                  subcategory: foundSubcategory
            })
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

      const totalItems = await SubcategoryModel.find(filter).countDocuments();
      const items = await SubcategoryModel.find(filter)
            .skip((pageSize * (currentPage - 1)))
            .limit(pageSize)
            .sort({ [sortBy]: sortOrder })
            .lean()

      for (let i = 0; i < items.length; i++) {
            const subcategory = items[i];
            const category = await CategoryModel.findById(subcategory.categoryId).select(' -_id name banner').lean();
            if (category) {
                  items[i] = {
                        ...subcategory,
                        category
                  }
            }
      }

      const responseObject = {
            status: true,
            message: "Subcategory fetched Successfully",
            totalPages: Math.ceil(totalItems / pageSize),
            totalItems,
            subcategories: items
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

// Update subcategory by Id
const update = async (req, res) => {

      const { id } = req.params
      let subcategoryDetails = {}

      try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `Subcategory Id incorrect`
                  })
            }

            const subcategory = await SubcategoryModel.findById(id)
            const subcategoryExist = Boolean(subcategory)

            if (!subcategoryExist) {
                  return res.status(401).json({
                        status: false,
                        message: `Subcategory doesn't exist`,
                  });
            }

            else {
                  subcategoryDetails = {
                        ...req.body,
                        updatedAt: new Date()
                  }
            }

            const updatedSubcategory = await SubcategoryModel.findByIdAndUpdate
                  (
                        id, subcategoryDetails,
                        {
                              new: true,
                              runValidators: true
                        }
                  )

            res.status(201).json({
                  status: true,
                  message: "Subcategory updated successfully",
                  subcategory: updatedSubcategory
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
      subcategories,
      subcategory,
      update
}