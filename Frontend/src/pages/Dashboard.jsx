// pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:4999/api'

function formatDateTime(date, time) {
    const [hStr] = time.split(':')
    const h = parseInt(hStr, 10)
    const label = h < 12 ? `${h}:00 AM` : `${h === 12 ? 12 : h - 12}:00 PM`
    return `${date} · ${label}`
}

const Dashboard = () => {
    const [bookings, setBookings] = useState([])
    const [slug, setSlug] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const fetchBookings = useCallback(async () => {
        setLoading(true)
        setError('')
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/login')
            return
        }

        try {
            const res = await fetch(`${API_BASE}/dashboard/bookings`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (res.status === 401) {
                localStorage.removeItem('token')
                navigate('/login')
                return
            }
            if (!res.ok) {
                setError('Could not load bookings.')
                return
            }

            const data = await res.json()
            setBookings(data.bookings)
            setSlug(data.slug)
        } catch {
            setError('Network error — check your connection.')
        } finally {
            setLoading(false)
        }
    }, [navigate])

    useEffect(() => {
        fetchBookings()
    }, [fetchBookings])

    function handleLogout() {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className='min-h-screen bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white px-4 sm:px-8 py-8'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex items-center justify-between mb-2'>
                    <h1 className='text-xl font-bold'>Bookings</h1>
                    <div className='flex gap-2'>
                        <button
                            onClick={fetchBookings}
                            className='border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-xs font-bold cursor-pointer'
                        >
                            Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            className='border border-gray-800 dark:border-gray-300 rounded-md px-3 py-1.5 text-xs font-bold cursor-pointer'
                        >
                            Log out
                        </button>
                    </div>
                </div>

                {slug && (
                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-6'>
                        Your booking page:{' '}
                        <a href={`/${slug}`} target='_blank' rel='noreferrer' className='text-indigo-500 dark:text-indigo-400 font-mono'>
                            yourapp.com/{slug}
                        </a>
                    </div>
                )}

                {error && <div className='text-xs text-red-600 dark:text-red-400 mb-4'>{error}</div>}

                {loading ? (
                    <div className='text-sm text-gray-500 dark:text-gray-400 font-mono'>Loading…</div>
                ) : bookings.length === 0 ? (
                    <div className='text-sm text-gray-500 dark:text-gray-400 font-mono'>No bookings yet.</div>
                ) : (
                    <div className='flex flex-col gap-2'>
                        {bookings.map((b) => (
                            <div
                                key={b.id}
                                className='border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'
                            >
                                <div>
                                    <div className='font-bold text-sm'>{b.name}</div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>{b.email}</div>
                                    {b.note && <div className='text-xs mt-1 text-gray-600 dark:text-gray-300'>"{b.note}"</div>}
                                </div>
                                <div className='text-right'>
                                    <div className='font-mono text-sm'>{formatDateTime(b.date, b.time)}</div>
                                    <div className='text-xs text-gray-500 dark:text-gray-400'>{b.duration_minutes} min</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard