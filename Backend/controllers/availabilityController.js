const pool = require('../config/db')


const getAvailability = async (req, res) => {
    const { id, month } = req.query

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ error: 'Query param "month" must be in YYYY-MM format.' });
    }

    try {
        const result = await pool.query(
            `SELECT to_char(date, 'YYYY-MM-DD') AS date, time, is_booked
            FROM availability_slots
            WHERE to_char(date, 'YYYY-MM') = $1
            ORDER BY date, time`,
            [month]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch availability.' });
    }
}

module.exports = { getAvailability }