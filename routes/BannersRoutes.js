const express = require('express')
const router = express.Router()

const { tokenVerify } = require('../utilities/tokenVerify')

const {
      createBanner,
      getBanners
} = require('../controllers/BannersController')

router.post('/', tokenVerify, createBanner) // Create a banner
router.get('/', getBanners) // Get all Banners

module.exports = router