import React, { useState } from 'react'
import { useAuth } from '../hook/UseAuth'
import { useSelector } from 'react-redux'
import {
  Link,
  Navigate,
  useNavigate,
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { login } from '../services/api.auth';


export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })


  let [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedInput, setFocusedInput] = useState(null)

  const user = useSelector(state => state.auth.user)
  loading = useSelector(state => state.auth.loading)

  const { handleLogin } = useAuth()

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = {
      email: formData.email,
      password: formData.password
    }

    try {
  await handleLogin(payload);
  navigate("/");
} catch (err) {
  setError(err.message || "Login failed");
}
    try {
      // TODO: Connect to your backend API
      console.log('Login Data:', formData)
      // Example: const response = await fetch('http://localhost:5000/api/auth/login', { ... })
      alert('Login attempted with:', formData.email)
    } catch (err) {
      setError( err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  const primaryColor = '#31b8c6'
  const primaryColorDark = '#1a8899'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Gradient Background Card */}
        <div className="p-0.5 rounded-2xl shadow-2xl" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorDark} 100%)` }}>
          <div className="bg-gray-900 rounded-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent mb-2" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColorDark})` }}>
                Welcome Back
              </h1>
              <p className="text-gray-400 text-sm">Sign in to your account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: `${primaryColor}20`, borderColor: primaryColor, borderWidth: '1px', color: primaryColor }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white placeholder-gray-500 outline-none transition"
                  style={{
                    borderColor: focusedInput === 'email' ? primaryColor : '#374151',
                    boxShadow: focusedInput === 'email' ? `0 0 0 3px ${primaryColor}33` : 'none'
                  }}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white placeholder-gray-500 outline-none transition"
                  style={{
                    borderColor: focusedInput === 'password' ? primaryColor : '#374151',
                    boxShadow: focusedInput === 'password' ? `0 0 0 3px ${primaryColor}33` : 'none'
                  }}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-2"
                  style={{ accentColor: primaryColor }}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-400 cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                style={{
                  background: loading ? '#6b7280' : `linear-gradient(to right, ${primaryColor}, ${primaryColorDark})`,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 space-y-3">
              <div className="text-center">
                <a href="#" className="text-sm transition hover:opacity-80" style={{ color: primaryColor, textDecoration: 'none' }}>
                  Forgot your password?
                </a>
              </div>
              <div className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium transition hover:opacity-80"
                  style={{ color: primaryColor, textDecoration: 'none' }}
                >
                  Sign up here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
