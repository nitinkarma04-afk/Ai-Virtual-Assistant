import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Bot,
  Sun,
  Moon,
} from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { getErrorMessage } from '../../services/api'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Card } from '../../components/common/Card'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }

    if (serverError) {
      setServerError('')
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
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

      const assistant =
        loginRes?.assistant ||
        loginRes?.data?.assistant

      const hasConfiguredAssistant = Boolean(
        assistant &&
        (assistant.name || assistant.assistantName)
      )

      const fromPath =
        location.state?.from?.pathname

      if (
        fromPath &&
        fromPath !== '/login' &&
        fromPath !== '/signup'
      ) {
        navigate(fromPath, {
          replace: true,
        })
      } else {
        navigate(
          hasConfiguredAssistant
            ? '/dashboard'
            : '/assistant-setup',
          {
            replace: true,
          }
        )
      }
    } catch (err) {
      console.error('Login error:', err)
      setServerError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-slate-50
        dark:bg-slate-950
        text-slate-900
        dark:text-slate-100
        flex
        flex-col
        justify-center
        items-center
        px-4
        py-8
        sm:px-6
        relative
        selection:bg-cyan-500/30
        selection:text-cyan-800
        dark:selection:text-cyan-200
        transition-colors
        duration-200
      "
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          title={
            theme === 'dark'
              ? 'Switch to Light Mode'
              : 'Switch to Dark Mode'
          }
          aria-label={
            theme === 'dark'
              ? 'Switch to Light Mode'
              : 'Switch to Dark Mode'
          }
          className="
            p-2
            rounded-xl
            border
            border-slate-200
            dark:border-slate-800
            bg-white/80
            dark:bg-slate-900/80
            text-slate-600
            dark:text-slate-300
            hover:text-cyan-600
            dark:hover:text-cyan-400
            hover:border-cyan-500/40
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-cyan-500
            transition-all
            cursor-pointer
            shadow-xs
          "
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>
      </div>

      {/* Background Glow */}
      <div
        className="
          absolute
          top-1/4
          -right-32
          w-72
          sm:w-96
          h-72
          sm:h-96
          bg-cyan-500/10
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-1/4
          -left-32
          w-72
          sm:w-96
          h-72
          sm:h-96
          bg-blue-500/10
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      {/* Main Content */}
      <div
        className="
          w-full
          max-w-md
          min-w-0
          relative
          z-10
        "
      >
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <Link
            to="/"
            className="
              inline-flex
              max-w-full
              items-center
              gap-2
              px-3
              py-1
              rounded-full
              bg-white
              dark:bg-slate-900
              border
              border-slate-200
              dark:border-slate-800
              text-xs
              font-mono
              text-cyan-600
              dark:text-cyan-400
              hover:border-cyan-500/40
              transition-colors
              shadow-xs
            "
          >
            <Bot className="w-3.5 h-3.5 text-cyan-500 shrink-0" />

            <span className="truncate">
              Jarvis AI Assistant
            </span>
          </Link>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              tracking-tight
              text-slate-900
              dark:text-white
            "
          >
            Welcome Back
          </h1>

          <p
            className="
              text-xs
              sm:text-sm
              leading-relaxed
              text-slate-600
              dark:text-slate-400
              px-2
            "
          >
            Sign in to access your assistant & personal memories
          </p>
        </div>

        {/* Login Card */}
        <Card
          variant="glass"
          className="
            w-full
            min-w-0
            p-5
            sm:p-8
            space-y-5
            border-slate-200
            dark:border-slate-800
            shadow-xl
          "
        >
          {/* Server Error */}
          {serverError && (
            <div
              className="
                w-full
                min-w-0
                p-3.5
                rounded-xl
                bg-rose-500/10
                border
                border-rose-500/30
                text-rose-700
                dark:text-rose-300
                text-xs
                flex
                items-start
                gap-2.5
              "
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />

              <div className="flex-1 min-w-0 leading-relaxed break-words">
                {serverError}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="w-full min-w-0 space-y-4"
            noValidate
          >
            <div className="w-full min-w-0">
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
            </div>

            <div className="w-full min-w-0">
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
              Sign In to Assistant
            </Button>
          </form>

          {/* Signup */}
          <div
            className="
              pt-4
              border-t
              border-slate-200
              dark:border-slate-800/80
              text-center
            "
          >
            <p
              className="
                text-xs
                sm:text-sm
                text-slate-600
                dark:text-slate-400
                leading-relaxed
              "
            >
              New to Jarvis AI?{' '}

              <Link
                to="/signup"
                className="
                  font-medium
                  text-cyan-600
                  dark:text-cyan-400
                  hover:text-cyan-500
                  hover:underline
                  transition-colors
                  ml-1
                  whitespace-nowrap
                "
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