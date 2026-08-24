// pages/Onboarding.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'https://booking-app-xbb7.onrender.com/api'
const DAYS = [
    { label: 'M', value: 1 },
    { label: 'T', value: 2 },
    { label: 'W', value: 3 },
    { label: 'T', value: 4 },
    { label: 'F', value: 5 },
    { label: 'S', value: 6 },
    { label: 'S', value: 7 },
]

const Onboarding = () => {
    const [slug, setSlug] = useState('')
    const [startHour, setStartHour] = useState(9)
    const [endHour, setEndHour] = useState(17)
    const [workDays, setWorkDays] = useState([1, 2, 3, 4, 5])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function toggleDay(day) {
        setWorkDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
        )
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!slug.trim()) {
            setError('Pick a url for your booking page.')
            return
        }
        if (workDays.length === 0) {
            setError('Select at least one working day.')
            return
        }

        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${API_BASE}/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    slug: slug.trim().toLowerCase(),
                    workStartHour: Number(startHour),
                    workEndHour: Number(endHour),
                    workDays,
                }),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Could not complete onboarding.')
                return
            }

            navigate('/dashboard')
        } catch {
            setError('Network error — check your connection.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white px-4'>
            <form onSubmit={handleSubmit} className='w-full max-w-md border border-gray-200 dark:border-gray-700 rounded-2xl p-8'>
                <p className='text-xs font-bold text-gray-400 dark:text-gray-500 mb-1'>step 1 of 1</p>
                <h1 className='text-xl font-bold mb-1'>Set up your booking page</h1>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                    This is what clients will see and use to book you.
                </p>

                <label className='flex flex-col gap-1 mb-5'>
                    <span className='text-xs font-bold text-gray-500 dark:text-gray-400'>Your booking url</span>
                    <div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden'>
                        <span className='px-3 py-2 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800'>
                            yourapp.com/
                        </span>
                        <input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder='kelechi'
                            className='flex-1 bg-transparent px-3 py-2 text-sm outline-none'
                        />
                    </div>
                </label>

                <label className='block mb-5'>
                    <span className='text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2'>Working days</span>
                    <div className='flex gap-2'>
                        {DAYS.map((d) => (
                            <button
                                type='button'
                                key={d.value}
                                onClick={() => toggleDay(d.value)}
                                className={`w-8 h-8 rounded-full text-xs font-bold cursor-pointer
                                    ${workDays.includes(d.value)
                                        ? 'bg-indigo-500 text-white'
                                        : 'border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'}`}
                            >
                                {d.label}
                            </button>
                        ))}
                    </div>
                </label>

                <label className='block mb-6'>
                    <span className='text-xs font-bold text-gray-500 dark:text-gray-400 block mb-2'>Hours</span>
                    <div className='flex items-center gap-2'>
                        <input
                            type='number'
                            min='0'
                            max='23'
                            value={startHour}
                            onChange={(e) => setStartHour(e.target.value)}
                            className='flex-1 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md px-3 py-2 text-sm outline-none'
                        />
                        <span className='text-sm text-gray-400 dark:text-gray-500'>to</span>
                        <input
                            type='number'
                            min='0'
                            max='23'
                            value={endHour}
                            onChange={(e) => setEndHour(e.target.value)}
                            className='flex-1 border border-gray-300 dark:border-gray-600 bg-transparent rounded-md px-3 py-2 text-sm outline-none'
                        />
                    </div>
                </label>

                {error && <div className='text-xs text-red-600 dark:text-red-400 mb-4'>{error}</div>}

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full py-2.5 rounded-md bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-bold text-sm disabled:opacity-50 cursor-pointer'
                >
                    {loading ? 'Setting up…' : 'Continue →'}
                </button>
            </form>
        </div>
    )
}

export default Onboarding