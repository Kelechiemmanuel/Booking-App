// controllers/bookingsController.js
const pool = require('../config/db')
// const { sendBookingNotification } = require('../utils/mailer') // wire up once mailer is set up in this project

const createBooking = async (req, res) => {
    const { slug } = req.params
    const { date, time, name, email, note, duration } = req.body

    if (!date || !time || !name || !email || !duration) {
        return res.status(400).json({ message: 'date, time, name, email, and duration are required.' })
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email address.' })
    }

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const userResult = await client.query('SELECT id, name, email FROM users WHERE slug = $1', [slug])
        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ message: 'No booking page found for that link.' })
        }
        const owner = userResult.rows[0]

        const slotResult = await client.query(
            `SELECT id, is_booked FROM availability_slots
             WHERE user_id = $1 AND date = $2 AND time = $3
             FOR UPDATE`,
            [owner.id, date, time]
        )

        if (slotResult.rows.length === 0) {
            await client.query('ROLLBACK')
            return res.status(404).json({ message: 'That slot does not exist.' })
        }
        if (slotResult.rows[0].is_booked) {
            await client.query('ROLLBACK')
            return res.status(409).json({ message: 'That slot is no longer available.' })
        }

        const slotId = slotResult.rows[0].id

        await client.query(
            `UPDATE availability_slots SET is_booked = TRUE WHERE id = $1`,
            [slotId]
        )

        const bookingResult = await client.query(
            `INSERT INTO bookings (slot_id, name, email, note, duration_minutes)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [slotId, name, email, note || null, duration]
        )

        await client.query('COMMIT')

        // sendBookingNotification({ ...bookingResult.rows[0], date, time, notifyEmail: owner.email })
        //   .catch(err => console.error('Failed to send notification email:', err))

        return res.status(201).json(bookingResult.rows[0])
    } catch (error) {
        await client.query('ROLLBACK')
        console.error('Create booking error:', error)
        return res.status(500).json({ message: 'Booking failed.' })
    } finally {
        client.release()
    }
}

module.exports = { createBooking }