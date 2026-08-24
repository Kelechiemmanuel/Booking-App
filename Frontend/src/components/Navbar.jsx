import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import ThemeToggle from '../utils/ThemeToggle'
import { useAuthModal } from '../utils/AuthModalProvider'

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const { openLogin, openSignup } = useAuthModal()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'))
    }, [location])

    function handleLogout() {
        localStorage.removeItem('token')
        setIsLoggedIn(false)
        navigate('/')
    }

    return (
        <header className='dark:bg-white bg-[#0F172A] dark:text-[#0F172A] text-white border-b dark:border-gray-100 border-gray-800 sticky top-0 z-50'>
            <nav className='max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4'>
                <Link to='/' className='font-bold text-sm tracking-widest'>
                    A K E S T A C K
                </Link>

                <div className='flex items-center gap-3 sm:gap-5'>
                    {isLoggedIn ? (
                        <>
                            <Link to='/dashboard' className='text-sm font-medium dark:text-gray-600 text-gray-300 dark:hover:text-[#0F172A] hover:text-white' >
                                Dashboard
                            </Link>
                            <button onClick={handleLogout} className='cursor-pointer border border-gray-800 dark:border-white py-1.5 px-4 rounded-sm text-sm font-bold'>
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={openLogin} className='cursor-pointer text-sm font-medium dark:text-gray-600 text-gray-300 dark:hover:text-[#0F172A] hover:text-white'>
                                Log in
                            </button>
                            <button onClick={openSignup} className='cursor-pointer dark:bg-[#0F172A] dark:text-white bg-white text-[#0F172A] py-1.5 px-4 rounded-sm text-sm font-bold'>
                                Sign up
                            </button>
                        </>
                    )}
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    )
}

export default Navbar