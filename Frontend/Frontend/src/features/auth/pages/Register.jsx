import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { register } from "../services/api.auth.js"; // path apne project ke hisab se

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

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
    setSuccess(false)
    setLoading(true)

    try {
      // TODO: Connect to your backend API
      // console.log('Register Data:', formData)
      // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(formData),
      //   credentials:"include",
      // })



      console.log("Register Data:", formData);

      const data = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log("Register Response:", data)

      setSuccess(true)
      setFormData({ username: '', email: '', password: '' })
      alert('Registration successful! Please log in.')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
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
                Create Account
              </h1>
              <p className="text-gray-400 text-sm">Join us today and get started</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: `${primaryColor}20`, borderColor: primaryColor, borderWidth: '1px', color: primaryColor }}>
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-900/30 border border-green-600 rounded-lg text-green-400 text-sm">
                Account created successfully!
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  required
                  placeholder="Choose a username"
                  className="w-full px-4 py-3 bg-gray-800 border-2 rounded-lg text-white placeholder-gray-500 outline-none transition"
                  style={{
                    borderColor: focusedInput === 'username' ? primaryColor : '#374151',
                    boxShadow: focusedInput === 'username' ? `0 0 0 3px ${primaryColor}33` : 'none'
                  }}
                />
              </div>

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

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 mt-1 bg-gray-800 border-gray-700 rounded focus:ring-2"
                  style={{ accentColor: primaryColor }}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-400 cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="transition hover:opacity-80" style={{ color: primaryColor, textDecoration: 'none' }}>
                    Terms of Service
                  </a>
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
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium transition hover:opacity-80" style={{ color: primaryColor, textDecoration: 'none' }}>
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}