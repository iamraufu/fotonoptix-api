const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      create,
      subcategories,
      subcategory,
      update
} = require('../controllers/SubcategoryController')

router.post('/', tokenVerify, create) // Create a Sub Category
router.get('/', subcategories) // Get all categories
router.get('/:id', tokenVerify, subcategory) // Get single Sub Category
router.patch('/:id', tokenVerify, update) // Update single Sub Category

module.exports = router