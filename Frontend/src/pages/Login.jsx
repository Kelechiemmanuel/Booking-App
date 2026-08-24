// components/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:4999/api'

const Login = ({ open, onClose, onSwitchToSignup }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleClose() {
        setError('')
        onClose()
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')

        if (!email.trim() || !password.trim()) {
            setError('Email and password are required.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data.message || 'Invalid email or password.')
                return
            }

            localStorage.setItem('token', data.token)
            onClose()
            navigate('/onboarding')
        } catch {
            setError('Network error — check your connection.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className={`fixed inset-0 z-9999 flex items-center justify-center px-4 transition-opacity duration-300 ease-in-out
                ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className='absolute inset-0 bg-black/70' onClick={handleClose} />

            <form
                onSubmit={handleSubmit}
                className={`relative w-full max-w-sm bg-white dark:bg-[#0F172A] text-[#0F172A] dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl p-8 transition-transform duration-300 ease-in-out
                    ${open ? 'scale-100' : 'scale-95'}`}
            >
                <button
                    type='button'
                    onClick={handleClose}
                    className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer'
                >
                    ×
                </button>

                <h1 className='text-xl font-bold mb-1'>Welcome back</h1>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>Log in to your account.</p>

                <label className='flex flex-col gap-1 mb-4'>
                    <span className='text-xs font-bold text-gray-500 dark:text-gray-400'>Email</span>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='you@example.com'
                        className='border border-gray-300 dark:border-gray-600 bg-transparent rounded-md px-3 py-2 text-sm outline-none'
                    />
                </label>

                <label className='flex flex-col gap-1 mb-5'>
                    <span className='text-xs font-bold text-gray-500 dark:text-gray-400'>Password</span>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='••••••••'
                        className='border border-gray-300 dark:border-gray-600 bg-transparent rounded-md px-3 py-2 text-sm outline-none'
                    />
                </label>

                {error && <div className='text-xs text-red-600 dark:text-red-400 mb-4'>{error}</div>}

                <button
                    type='submit'
                    disabled={loading}
                    className='w-full py-2.5 rounded-md bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] font-bold text-sm disabled:opacity-50 cursor-pointer'
                >
                    {loading ? 'Signing in…' : 'Sign in'}
                </button>

                <p className='text-xs text-gray-400 dark:text-gray-500 text-center mt-4'>
                    Don't have an account?{' '}
                    <button type='button' onClick={onSwitchToSignup} className='text-indigo-500 dark:text-indigo-400 cursor-pointer'>
                        Sign up
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Login