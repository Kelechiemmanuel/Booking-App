// controllers/onboardingController.js
const pool = require('../config/db')

function formatDate(d) {
    return d.toISOString().slice(0, 10) // "2026-08-24"
}

function formatTime(hour) {
    return `${String(hour).padStart(2, '0')}:00:00`
}

async function generateSlotsForUser(userId, workStartHour, workEndHour, workDays, daysAhead = 60) {
    const today = new Date()
    let inserted = 0

    for (let i = 0; i < daysAhead; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        const jsDay = date.getDay() // Sun=0, Mon=1, ... Sat=6
        const isoDay = jsDay === 0 ? 7 : jsDay // convert to Mon=1 ... Sun=7

        if (!workDays.includes(isoDay)) continue

        for (let hour = workStartHour; hour < workEndHour; hour++) {
            await pool.query(
                `INSERT INTO availability_slots (user_id, date, time, is_booked)
                 VALUES ($1, $2, $3, FALSE)
                 ON CONFLICT (user_id, date, time) DO NOTHING`,
                [userId, formatDate(date), formatTime(hour)]
            )
            inserted++
        }
    }

    return inserted
}

const completeOnboarding = async (req, res) => {
    const userId = req.user.id
    const { slug, workStartHour, workEndHour, workDays } = req.body

    if (!slug || workStartHour === undefined || workEndHour === undefined || !workDays) {
        return res.status(400).json({ message: 'slug, workStartHour, workEndHour, and workDays are required.' })
    }

    if (!/^[a-z0-9-]{3,30}$/.test(slug)) {
        return res.status(400).json({ message: 'Slug must be lowercase letters, numbers, and hyphens only (3-30 chars).' })
    }

    if (!Array.isArray(workDays) || workDays.length === 0) {
        return res.status(400).json({ message: 'workDays must be a non-empty array (1=Mon ... 7=Sun).' })
    }

    if (workStartHour >= workEndHour) {
        return res.status(400).json({ message: 'workStartHour must be before workEndHour.' })
    }

    try {
        await pool.query(
            `UPDATE users
             SET slug = $1, work_start_hour = $2, work_end_hour = $3, work_days = $4
             WHERE id = $5`,
            [slug, workStartHour, workEndHour, workDays, userId]
        )

        const inserted = await generateSlotsForUser(userId, workStartHour, workEndHour, workDays)

        return res.status(200).json({
            message: 'Onboarding complete',
            slug,
            slotsGenerated: inserted
        })
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'That url is already taken.' })
        }
        console.error('Onboarding error:', error)
        return res.status(500).json({ message: 'Something went wrong.' })
    }
}

module.exports = { completeOnboarding }