import React from 'react'
import Calendar from './Components/Calendar/Calendar'
import { Routes, Route, useLocation } from 'react-router-dom'
import LoginPage from './Components/Pages/LoginPage'
import RegisterPage from './Components/Pages/RegisterPage';
import ResetPasswordPage from './Components/Pages/ResetPasswordPage';
import ActivatePage from './Components/Pages/ActivatePage';
import NotFoundPage from './Components/Pages/NotFoundPage';
const App = () => {
  const location = useLocation();
  const noCalendar = location.pathname === '/' || location.pathname === '/register' || location.pathname === '/reset-password'|| location.pathname === '/activatepage'
  return (
    <>
      {
        noCalendar ?
          <Routes >
            <Route path='/' element={<LoginPage />} />
            <Route path='/activatepage' element={<ActivatePage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/reset-password' element={<ResetPasswordPage />} />
          </Routes>
          :
          <Routes >
            <Route path='*' element={ <NotFoundPage />} />
            <Route path='/calendar' element={<Calendar />} />
          </Routes>
      }
    </>
  )
}

export default App
