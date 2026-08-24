require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://booking-app-seven-rosy.vercel.app/"
    ],
    credentials: true
}));

app.use('/api/auth', require('./Routes/authRoute'))
app.use('/api/onboarding', require('./Routes/onboardingRoute'))
app.use('/api/availability', require('./Routes/availabilityRoute'))
app.use('/api/bookings', require('./Routes/bookingsRoute'))
app.use('/api/dashboard', require('./Routes/dashboardRoute'))

const PORT = process.env.PORT || 4999
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

})