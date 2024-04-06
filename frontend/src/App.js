import React from 'react'
import './app.scss'

// import Layout from './components/layout'  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './utils/protectedRoutes'  
import { AuthProvider } from './context/authContext'
import { Home,
     Login, 
     Signup, 
     Profile, 
     About,
     CreateLeagues, 
     JoinLeagues, 
     MyLeagues, 
     LeagueHomePage, 
     MyRoster, 
     MySchedule, 
     LeagueRosters,
     FreeAgency, 
     Matchup, 
     Settings, 
    } from './pages'

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
                            <Route path="roster" element={<MyRoster />} />
                            <Route path="matchup" element={<Matchup />} />
                            <Route path="schedule" element={<MySchedule />} /> 
                            <Route path="free-agency" element={<FreeAgency />} />
                            <Route path="rosters" element={<LeagueRosters />} />
                            <Route path="settings" element={<Settings />} />
                    </Routes>
                    
                </AuthProvider>    
            </Router>            
        </>        
  )
}
export default App