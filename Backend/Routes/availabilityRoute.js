const express = require('express')
const router = express.Router()
const { getAvailability } = require('../controllers/availabilityController')

router.get('/:slug', getAvailability)

module.exports = router