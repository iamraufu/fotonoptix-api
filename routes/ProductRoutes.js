const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      create,
      products,
      product,
      update
} = require('../controllers/ProductController')

router.post('/', tokenVerify, create) // Create a product
router.get('/', products) // Get all products
router.get('/:id', tokenVerify, product) // Get single product
router.patch('/:id', tokenVerify, update) // Update single product

module.exports = router