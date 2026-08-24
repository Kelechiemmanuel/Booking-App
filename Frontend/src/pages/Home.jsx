import { useState } from 'react';
import { useAuthModal } from '../utils/AuthModalProvider'
import OpeningAnimation from '../utils/OpeningAnimation';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const { openSignup } = useAuthModal()

    function scrollToHowItWorks() {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <>
            {loading && (
                <OpeningAnimation onComplete={() => setLoading(false)} />
            )}
            <div className='dark:bg-white bg-[#0F172A] dark:text-[#0F172A] text-white'>
                <div className='max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24'>

                    <div className='text-center'>
                        <p className='text-xs font-bold tracking-widest uppercase text-indigo-500 dark:text-indigo-400 mb-3'>
                            stop playing calendar tag
                        </p>
                        <h1 className='text-3xl sm:text-4xl font-bold mb-4'>
                            One link. Zero back and forth.
                        </h1>
                        <p className='text-sm sm:text-base dark:text-gray-500 text-gray-400 mb-8 max-w-md mx-auto leading-relaxed'>
                            Share your booking page, set your hours once, and let people grab an open slot.
                            You show up. That's the whole job now.
                        </p>
                        <div className='flex flex-col sm:flex-row justify-center gap-3'>
                            <button
                                onClick={openSignup}
                                className='cursor-pointer dark:bg-[#0F172A] dark:text-white bg-white text-[#0F172A] font-bold text-sm py-2.5 px-6 rounded-md'
                            >
                                Claim your link →
                            </button>
                            <button
                                onClick={scrollToHowItWorks}
                                className='cursor-pointer border dark:border-gray-300 border-gray-600 font-bold text-sm py-2.5 px-6 rounded-md'
                            >
                                See it in action
                            </button>
                        </div>
                    </div>

                    <div className='grid grid-cols-3 gap-3 mt-12'>
                        <div className='dark:bg-gray-50 bg-gray-800/60 rounded-lg py-4 text-center'>
                            <p className='text-xl font-bold'>2 min</p>
                            <p className='text-xs dark:text-gray-500 text-gray-400'>to set up</p>
                        </div>
                        <div className='dark:bg-gray-50 bg-gray-800/60 rounded-lg py-4 text-center'>
                            <p className='text-xl font-bold'>0</p>
                            <p className='text-xs dark:text-gray-500 text-gray-400'>double bookings</p>
                        </div>
                        <div className='dark:bg-gray-50 bg-gray-800/60 rounded-lg py-4 text-center'>
                            <p className='text-xl font-bold'>free</p>
                            <p className='text-xs dark:text-gray-500 text-gray-400'>to start</p>
                        </div>
                    </div>

                    <p className='text-xs font-bold tracking-widest uppercase dark:text-gray-400 text-gray-500 text-center mt-16 mb-4'>
                        what you get
                    </p>
                    <div className='grid sm:grid-cols-2 gap-3'>
                        <div className='border border-gray-200 dark:border-gray-700 rounded-xl p-4'>
                            <p className='font-bold text-sm mb-1'>A link that's just yours</p>
                            <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>
                                yourapp.com/you — drop it in your bio, your email footer, anywhere.
                            </p>
                        </div>
                        <div className='border dark:border-gray-200 border-gray-700 rounded-xl p-4'>
                            <p className='font-bold text-sm mb-1'>Slots that can't collide</p>
                            <p className='text-xs dark:text-gray-500 text-gray-400 leading-relaxed'>
                                Two people can't grab the same time, even if they click at once.
                            </p>
                        </div>
                        <div className='border dark:border-gray-200 border-gray-700 rounded-xl p-4'>
                            <p className='font-bold text-sm mb-1'>Reminders sent for you</p>
                            <p className='text-xs dark:text-gray-500 text-gray-400 leading-relaxed'>
                                Both sides get an email before the session. Nobody forgets.
                            </p>
                        </div>
                        <div className='border dark:border-gray-200 border-gray-700 rounded-xl p-4'>
                            <p className='font-bold text-sm mb-1'>One dashboard, all bookings</p>
                            <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>
                                See who's coming, when, and why — in one place.
                            </p>
                        </div>
                    </div>

                    <p id='how-it-works' className='text-xs font-bold tracking-widest uppercase dark:text-gray-400 text-gray-500 text-center mt-16 mb-6 scroll-mt-8'>
                        how it works
                    </p>
                    <div className='flex flex-col sm:flex-row gap-6 sm:gap-3'>
                        <div className='flex-1 text-center'>
                            <div className='w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold mx-auto mb-2'>1</div>
                            <p className='font-bold text-sm mb-0.5'>Set your hours</p>
                            <p className='text-xs dark:text-gray-500 text-gray-400'>Pick your days and times once.</p>
                        </div>
                        <div className='flex-1 text-center'>
                            <div className='w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold mx-auto mb-2'>2</div>
                            <p className='font-bold text-sm mb-0.5'>Share your link</p>
                            <p className='text-xs dark:text-gray-500 text-gray-400'>Anywhere people already find you.</p>
                        </div>
                        <div className='flex-1 text-center'>
                            <div className='w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold mx-auto mb-2'>3</div>
                            <p className='font-bold text-sm mb-0.5'>Show up</p>
                            <p className='text-xs dark:text-gray-500 text-gray-400'>We handle slots, emails, and reminders.</p>
                        </div>
                    </div>

                    <div className='dark:bg-gray-50 bg-gray-800/60 rounded-xl p-6 text-center mt-16'>
                        <p className='text-sm leading-relaxed mb-2'>
                            "I used to lose half a day to back-and-forth emails just to lock in a call.
                            Now I just send the link."
                        </p>
                        <p className='text-xs dark:text-gray-400 text-gray-500'>— an early user</p>
                    </div>

                    <div className='border dark:border-gray-200 border-gray-700 rounded-xl p-8 text-center mt-8'>
                        <p className='font-bold text-base mb-1'>Your link is waiting</p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-5'>
                            Set up takes less time than reading this page did.
                        </p>
                        <button
                            onClick={openSignup}
                            className='cursor-pointer dark:bg-[#0F172A] dark:text-white bg-white text-[#0F172A] font-bold text-sm py-2.5 px-6 rounded-md'
                        >
                            Claim your link →
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Home