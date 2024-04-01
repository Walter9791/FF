import React from 'react'
import './app.scss'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './utils/protectedRoutes'  
import { AuthProvider } from './context/authContext'
import { Home, Login, Signup, Profile, About, CreateLeagues, JoinLeagues, MyLeagues, LeagueHomePage} from './pages'

const App = () => {
  return (
            <>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/profile' element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>} />
                        <Route path='/create-league' element={
                            <ProtectedRoute>
                                <CreateLeagues />
                            </ProtectedRoute>} />
                        <Route path='/join-league' element={
                            <ProtectedRoute>
                                <JoinLeagues />
                            </ProtectedRoute>} />
                        <Route path='/my-leagues' element={
                            <ProtectedRoute>
                                <MyLeagues />
                            </ProtectedRoute>} /> 
                        <Route path='/my-leagues/:leagueId' element={
                            <ProtectedRoute>
                                <LeagueHomePage />
                            </ProtectedRoute>} />                        
                    </Routes>
                </AuthProvider>    
            </Router>            
        </>        
  )
}
export default App