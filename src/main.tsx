import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider, useAuth } from './AuthContext'
import CloudLens from './CloudLens'
import LoginPage from './LoginPage'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#080C18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Mono', 'Fira Code', monospace",
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
      }}>
        Loading...
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return <CloudLens />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
