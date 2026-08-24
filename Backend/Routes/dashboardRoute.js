const express = require('express')
const router = express.Router()
const { authToken } = require('../middleware/authMiddleware')
const { getMyBookings } = require('../controllers/dashboardController')

router.get('/bookings', authToken, getMyBookings)

module.exports = router