import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import Timelapse from './pages/Timelapse'
import BlueSward from './pages/BlueSward'
import Settings from './pages/Settings'
import LoadingScreen from './components/LoadingScreen'
import BottomNavBar from './components/BottomNavBar'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

// Protected route component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/" />
  }
  
  return <>{children}</>
}

function AppContent() {
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="app">
      {/* Hamburger menu appears on all pages */}
      <BottomNavBar />

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={
          user && !user.hasCompletedSignup 
            ? <SignUpPage /> 
            : <Navigate to={user ? "/profile" : "/"} />
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/timelapse" element={
          <ProtectedRoute>
            <Timelapse />
          </ProtectedRoute>
        } />
        <Route path="/sward" element={
          <ProtectedRoute>
            <BlueSward />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App