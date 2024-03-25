import React from 'react'
import './app.scss'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './utils/protectedRoutes'  
import { AuthProvider } from './context/authContext'
import {Home, Login, Signup, Profile} from './pages'

const App = () => {
  return (
    <div className = 'App'>
        <div className='container'>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/profile'element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>} />                       
                    </Routes>
                </AuthProvider>
            </Router>
        </div>
    </div>
  )
}
export default App