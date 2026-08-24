import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import PublicBooking from './pages/PublicBooking'
import { AuthModalProvider } from './utils/AuthModalProvider'

const App = () => {
  return (
    <div className='h-screen dark:bg-white bg-[#0F172A] dark:text-[#0F172A] text-white border-gray-700 dark:border-gray-300 transition-colors duration-300'>
      <AuthModalProvider>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/onboarding' element={<Onboarding />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/:slug' element={<PublicBooking />} />
          </Route>
        </Routes>
      </AuthModalProvider>
    </div>
  )
}

export default App