const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      create,
      categories,
      category,
      update
} = require('../controllers/CategoryController')

router.post('/', tokenVerify, create) // Create a Category
router.get('/', categories) // Get all categories
router.get('/:id', tokenVerify, category) // Get single category
router.patch('/:id', tokenVerify, update) // Update single category

module.exports = router