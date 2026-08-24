const express = require('express')
const router = express.Router()
const { authToken } = require('../middleware/authMiddleware')
const { completeOnboarding } = require('../controllers/onboardingController')

router.post('/', authToken, completeOnboarding)

module.exports = router