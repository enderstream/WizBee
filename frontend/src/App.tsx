import { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import SignUpPage from './pages/SignUpPage'
import Home from './pages/Home'
import Timelapse from './pages/Timelapse'
import Shooting from './pages/Shooting' // Shooting 컴포넌트 import 추가
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
        <Route
          path="/signup"
          element={
            user && !user.hasCompletedSignup ? (
              <SignUpPage />
            ) : (
              <Navigate to={user ? '/home' : '/'} />
            )
          }
        />
        <Route
          path="/home/*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/timelapse"
          element={
            <ProtectedRoute>
              <Timelapse />
            </ProtectedRoute>
          }
        />
        {/* Shooting 페이지를 위한 새 라우트 추가 */}
        <Route
          path="/shooting"
          element={
            <ProtectedRoute>
              <Shooting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sward"
          element={
            <ProtectedRoute>
              <BlueSward />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
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
