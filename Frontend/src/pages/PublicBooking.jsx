// pages/PublicBooking.jsx
import React, { useState, useMemo, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const API_BASE = 'https://booking-app-xbb7.onrender.com/api'
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
const DURATIONS = [
    { id: 15, label: "15 min" },
    { id: 30, label: "30 min" },
    { id: 60, label: "60 min" },
]

function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()) }
function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1) }
function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate() }
function isPast(d, today) { return startOfDay(d).getTime() < startOfDay(today).getTime() }
function toISODate(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
function formatLong(d) { return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}` }
function formatSlotLabel(time) {
    const h = parseInt(time.split(':')[0], 10)
    return h < 12 ? `${h}:00 AM` : `${h === 12 ? 12 : h - 12}:00 PM`
}
function buildMonthGrid(year, month) {
    const first = new Date(year, month, 1)
    const startOffset = (first.getDay() + 6) % 7
    const gridStart = new Date(year, month, 1 - startOffset)
    const cells = []
    for (let i = 0; i < 42; i++) cells.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i))
    const weeks = []
    for (let i = 0; i < 6; i++) {
        const week = cells.slice(i * 7, i * 7 + 7)
        if (week.some((d) => d.getMonth() === month)) weeks.push(week)
    }
    return weeks
}

const PublicBooking = () => {
    const { slug } = useParams()
    const today = useMemo(() => startOfDay(new Date()), [])

    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
    const [selectedDate, setSelectedDate] = useState(today)
    const [monthSlots, setMonthSlots] = useState({})
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const [duration, setDuration] = useState(30)
    const [selectedTime, setSelectedTime] = useState(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [note, setNote] = useState('')
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [confirmed, setConfirmed] = useState(null)

    const grid = useMemo(() => buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth()), [viewDate])

    useEffect(() => {
        const monthKey = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}`
        setLoadingSlots(true)
        fetch(`${API_BASE}/availability/${slug}?month=${monthKey}`)
            .then(r => {
                if (r.status === 404) { setNotFound(true); return null }
                return r.json()
            })
            .then(rows => {
                if (!rows) return
                const grouped = {}
                rows.forEach(row => {
                    if (!grouped[row.date]) grouped[row.date] = []
                    grouped[row.date].push(row)
                })
                setMonthSlots(grouped)
            })
            .catch(() => setErrors({ general: 'Could not load availability.' }))
            .finally(() => setLoadingSlots(false))
    }, [viewDate, slug])

    const selectedSlots = monthSlots[toISODate(selectedDate)] || []

    function availabilityLevel(day) {
        if (isPast(day, today) && !sameDay(day, today)) return -1
        const daySlots = monthSlots[toISODate(day)]
        if (!daySlots) return -1
        const free = daySlots.filter(s => !s.is_booked).length
        if (free === 0) return 0
        if (free <= 2) return 1
        if (free <= 4) return 2
        return 3
    }

    function pickDate(day) {
        if (isPast(day, today) && !sameDay(day, today)) return
        if (day.getMonth() !== viewDate.getMonth()) setViewDate(new Date(day.getFullYear(), day.getMonth(), 1))
        setSelectedDate(day)
        setSelectedTime(null)
        setErrors({})
    }

    async function submit() {
        const errs = {}
        if (!selectedTime) errs.time = 'Pick a time slot first.'
        if (!name.trim()) errs.name = 'Enter your name.'
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email.'
        setErrors(errs)
        if (Object.keys(errs).length > 0) return

        setSubmitting(true)
        try {
            const res = await fetch(`${API_BASE}/bookings/${slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: toISODate(selectedDate), time: selectedTime, name, email, note, duration }),
            })
            if (res.status === 409) {
                setErrors({ time: 'That slot was just taken — pick another.' })
                setSelectedTime(null)
                return
            }
            if (!res.ok) {
                setErrors({ general: 'Something went wrong. Try again.' })
                return
            }
            const data = await res.json()
            setConfirmed({ ...data, dateObj: selectedDate })
        } catch {
            setErrors({ general: 'Network error — check your connection.' })
        } finally {
            setSubmitting(false)
        }
    }

    if (notFound) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>No booking page found for "{slug}".</p>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white px-4 py-10'>
            <div className='max-w-xl mx-auto'>
                <h1 className='text-xl font-bold mb-1'>Book time with {slug}</h1>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>Pick a date, a slot, and a length.</p>

                {confirmed ? (
                    <div className='border border-gray-200 dark:border-gray-700 rounded-xl p-6'>
                        <div className='text-lg font-bold text-green-600 dark:text-green-400 mb-2'>✓ Confirmed</div>
                        <div className='text-sm'>{formatLong(confirmed.dateObj)} at {formatSlotLabel(selectedTime)}</div>
                        <div className='text-sm'>{confirmed.duration_minutes} min — {confirmed.name}</div>
                        <div className='text-xs text-gray-500 dark:text-gray-400 mt-2'>A confirmation will be sent to {confirmed.email}.</div>
                    </div>
                ) : (
                    <>
                        <div className='flex gap-2 mb-5'>
                            {DURATIONS.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => setDuration(d.id)}
                                    className={`flex-1 px-3 py-2 rounded-lg border text-sm cursor-pointer
                                        ${duration === d.id ? 'border-[#0F172A] dark:border-white bg-gray-100 dark:bg-gray-800' : 'border-gray-200 dark:border-gray-700'}`}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>

                        <div className='border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-5'>
                            <div className='flex items-center justify-between mb-3'>
                                <button onClick={() => setViewDate(addMonths(viewDate, -1))} className='w-7 h-7 rounded-full border cursor-pointer border-gray-300 dark:border-gray-600'>‹</button>
                                <span className='font-bold text-sm'>{MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                                <button onClick={() => setViewDate(addMonths(viewDate, 1))} className='w-7 h-7 rounded-full border cursor-pointer border-gray-300 dark:border-gray-600'>›</button>
                            </div>
                            <div className='grid grid-cols-7 gap-1 mb-1'>
                                {DAY_LABELS.map(d => <span key={d} className='text-[10px] text-center font-bold text-gray-500 dark:text-gray-400'>{d}</span>)}
                            </div>
                            {grid.map((week, wi) => (
                                <div className='grid grid-cols-7 gap-1' key={wi}>
                                    {week.map((day, di) => {
                                        const outside = day.getMonth() !== viewDate.getMonth()
                                        const level = availabilityLevel(day)
                                        const disabled = outside || level === -1
                                        const selected = sameDay(day, selectedDate)
                                        return (
                                            <button
                                                key={di}
                                                disabled={disabled}
                                                onClick={() => pickDate(day)}
                                                className={`h-9 rounded-md text-xs font-semibold flex flex-col items-center justify-center gap-0.5 cursor-pointer
                                                    ${disabled ? 'text-gray-300 dark:text-gray-600' : ''}
                                                    ${selected ? 'bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A]' : ''}`}
                                            >
                                                <span>{day.getDate()}</span>
                                                {!disabled && (
                                                    <span className={`w-1 h-1 rounded-full
                                                        ${selected ? 'bg-white dark:bg-[#0F172A]' :
                                                            level === 0 ? 'bg-gray-300 dark:bg-gray-600' :
                                                                level === 1 ? 'bg-green-300' :
                                                                    level === 2 ? 'bg-green-500' : 'bg-green-600'}`}
                                                    />
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className='text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2'>{formatLong(selectedDate)}</div>
                        <div className='bg-[#0F172A] rounded-xl p-2 mb-4 flex flex-col gap-0.5'>
                            {loadingSlots ? (
                                <div className='text-gray-400 text-xs font-mono p-3'>Loading…</div>
                            ) : selectedSlots.length === 0 ? (
                                <div className='text-gray-400 text-xs font-mono p-3'>No slots today.</div>
                            ) : (
                                selectedSlots.map(slot => (
                                    <button
                                        key={slot.time}
                                        disabled={slot.is_booked}
                                        onClick={() => setSelectedTime(slot.time)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono text-left cursor-pointer
                                            ${slot.is_booked ? 'text-gray-600' : 'text-gray-200'}
                                            ${selectedTime === slot.time ? 'bg-white/10 text-white' : ''}`}
                                    >
                                        <span className='flex-1'>{formatSlotLabel(slot.time)}</span>
                                        <span className='opacity-70'>{slot.is_booked ? 'booked' : selectedTime === slot.time ? 'selected' : 'open'}</span>
                                    </button>
                                ))
                            )}
                        </div>
                        {errors.time && <div className='text-xs text-red-600 dark:text-red-400 mb-3'>{errors.time}</div>}

                        <div className='border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3'>
                            <label className='flex flex-col gap-1'>
                                <span className='text-xs font-bold text-gray-500 dark:text-gray-400'>Name</span>
                                <input value={name} onChange={e => setName(e.target.value)} className='border border-gray-300 dark:border-gray-600 bg-transparent rounded-md px-3 py-2 text-sm outline-none' />
                                {errors.name && <span className='text-xs text-red-600 dark:text-red-400'>{errors.name}</span>}
                            </label>
                            <label className='flex flex-col gap-1'>
                                <span className='text-xs font-bold text-gray-500 dark:text-gray-400'>Email</span>
                                <input value={email} onChange={e => setEmail(e.target.value)} className='border border-gray-300 dark:border-gray-600 bg-transparent rounded-md px-3 py-2 text-sm outline-none' />
                                {errors.email && <span className='text-xs text-red-600 dark:text-red-400'>{errors.email}</span>}
                            </label>
                            <label className='flex flex-col gap-1'>
                                <span className='text-xs font-bold text-gray-500 dark:text-gray-400'>Note (optional)</span>
                                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className='border border-gray-300 dark:border-gray-600 bg-transparent rounded-md px-3 py-2 text-sm outline-none resize-none' />
                            </label>
                            {errors.general && <div className='text-xs text-red-600 dark:text-red-400'>{errors.general}</div>}
                            <button onClick={submit} disabled={submitting}
                                className='mt-1 py-2.5 rounded-md bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-bold text-sm disabled:opacity-50 cursor-pointer'>
                                {submitting ? 'Booking…' : 'Confirm booking'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default PublicBooking