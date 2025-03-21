import React, { createContext, useState, useContext, useEffect } from 'react'

interface User {
  id: string
  name?: string
  email?: string
  hasCompletedSignup: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  googleLogin: () => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const googleLogin = () => {
    // In a real app, you would implement actual Google OAuth here
    // For this demo, we'll simulate a successful login
    const newUser: User = {
      id: 'google-user-' + Date.now(),
      email: 'user@example.com',
      hasCompletedSignup: false
    }
    
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}