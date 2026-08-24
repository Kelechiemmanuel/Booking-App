const pool = require('../config/db')

const getMyBookings = async (req, res) => {
    const userId = req.user.id

    try {
        const userResult = await pool.query('SELECT slug, name FROM users WHERE id = $1', [userId])
        const owner = userResult.rows[0]

        const bookingsResult = await pool.query(
            `SELECT b.id, b.name, b.email, b.note, b.duration_minutes, b.created_at,
                    to_char(s.date, 'YYYY-MM-DD') AS date, s.time
             FROM bookings b
             JOIN availability_slots s ON b.slot_id = s.id
             WHERE s.user_id = $1
             ORDER BY s.date, s.time`,
            [userId]
        )

        return res.status(200).json({
            slug: owner.slug,
            name: owner.name,
            bookings: bookingsResult.rows
        })
    } catch (error) {
        console.error('Get my bookings error:', error)
        return res.status(500).json({ message: 'Failed to fetch bookings.' })
    }
}

module.exports = { getMyBookings }