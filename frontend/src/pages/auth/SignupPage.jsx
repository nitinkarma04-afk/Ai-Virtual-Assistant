import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../services/api'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'

export const SignupPage = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })
      navigate('/assistant-setup', { replace: true })
    } catch (err) {
      console.error('Signup error:', err)
      setServerError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 hover:border-cyan-500/40 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>NeuralCore Intelligence</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign up to calibrate your customized personal AI assistant
          </p>
        </div>

        {/* Signup Form Card */}
        <Card variant="glass" className="p-6 sm:p-8 space-y-5 border-slate-800 shadow-2xl">
          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="e.g. Nitin Sharma"
              value={formData.name}
              onChange={handleChange}
              icon={User}
              error={errors.name}
              required
              autoComplete="name"
            />

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
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />

            {/* Password Requirement Checklist */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    formData.password.length >= 6 ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
                <span>Minimum 6 characters</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    formData.password && formData.password === formData.confirmPassword
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                />
                <span>Passwords match</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="glow"
              size="md"
              isLoading={isSubmitting}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full mt-2"
            >
              Create Account & Configure Assistant
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Already calibrated?{' '}
              <Link
                to="/login"
                className="font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition-colors ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SignupPage
