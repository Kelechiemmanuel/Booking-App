import React, { createContext, useContext, useState } from 'react'
import Login from '../pages/Login'
import Signup from '../pages/Signup'

const AuthModalContext = createContext(null)

export function AuthModalProvider({ children }) {
    const [activeModal, setActiveModal] = useState(null) // 'login' | 'signup' | null

    const value = {
        openLogin: () => setActiveModal('login'),
        openSignup: () => setActiveModal('signup'),
        close: () => setActiveModal(null),
    }

    return (
        <AuthModalContext.Provider value={value}>
            {children}

            <Login
                open={activeModal === 'login'}
                onClose={value.close}
                onSwitchToSignup={value.openSignup}
            />
            <Signup
                open={activeModal === 'signup'}
                onClose={value.close}
                onSwitchToLogin={value.openLogin}
            />
        </AuthModalContext.Provider>
    )
}

export function useAuthModal() {
    const ctx = useContext(AuthModalContext)
    if (!ctx) {
        throw new Error('useAuthModal must be used inside an AuthModalProvider')
    }
    return ctx
}