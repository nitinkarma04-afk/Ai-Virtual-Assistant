import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, AlertCircle, ArrowRight, Bot } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../services/api'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (serverError) {
      setServerError('')
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    setIsSubmitting(true)
    try {
      const loginRes = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      const assistant = loginRes?.assistant || loginRes?.data?.assistant
      const hasConfiguredAssistant = Boolean(assistant && (assistant.name || assistant.assistantName))

      const fromPath = location.state?.from?.pathname
      if (fromPath && fromPath !== '/login' && fromPath !== '/signup') {
        navigate(fromPath, { replace: true })
      } else {
        navigate(hasConfiguredAssistant ? '/dashboard' : '/assistant-setup', { replace: true })
      }
    } catch (err) {
      console.error('Login error:', err)
      setServerError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient light */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 hover:border-cyan-500/40 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>NeuralCore Link</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to access your AI Assistant & Memory Vault
          </p>
        </div>

        {/* Login Form Card */}
        <Card variant="glass" className="p-6 sm:p-8 space-y-5 border-slate-800 shadow-2xl">
          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="glow"
              size="md"
              isLoading={isSubmitting}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full mt-2"
            >
              Sign In to Assistant
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              New to NeuralCore?{' '}
              <Link
                to="/signup"
                className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition-colors ml-1"
              >
                Create Account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
