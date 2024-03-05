const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      create,
      applications,
      application,
      update
} = require('../controllers/ApplicationController')

router.post('/', tokenVerify, create) // Create a Category
router.get('/', tokenVerify, applications) // Get all application
router.get('/:id', tokenVerify, application) // Get single application
router.patch('/:id', tokenVerify, update) // Update single application

module.exports = router