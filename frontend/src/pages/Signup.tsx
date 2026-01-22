import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Loader2, AlertCircle, ArrowRight, Zap, Check } from 'lucide-react'
import { useAuth } from '../stores/authStore'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export default function Signup() {
  const navigate = useNavigate()
  const { signUp, isLoading, error, clearError, isAuthenticated } = useAuth()
  
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Clear errors when inputs change
  useEffect(() => {
    if (error) clearError()
    setLocalError('')
  }, [email, username, password, confirmPassword])

  const validateForm = (): string | null => {
    if (!email.trim()) return 'Email is required'
    if (!email.includes('@')) return 'Please enter a valid email'
    if (!username.trim()) return 'Username is required'
    if (username.length < 3) return 'Username must be at least 3 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores'
    if (!password) return 'Password is required'
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (password !== confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    const validationError = validateForm()
    if (validationError) {
      setLocalError(validationError)
      return
    }

    const result = await signUp(email.trim(), password, username.trim())
    
    if (!result.error) {
      navigate('/', { replace: true })
    }
  }

  const displayError = localError || error

  // Password strength indicators
  const passwordChecks = {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password),
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      {/* Background decoration - subtle white/gray gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neutral-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Zap className="w-6 h-6 text-neutral-900" />
            </div>
            <span className="text-2xl font-bold text-white">OSITA</span>
          </div>
          <p className="text-neutral-500">CBAM Compliance Engine</p>
        </div>

        <Card className="bg-neutral-900/50 backdrop-blur-xl border-neutral-800" padding="lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-white">Create your account</h1>
            <p className="text-neutral-500 mt-1">Start your CBAM compliance journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Display */}
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{displayError}</p>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-700 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  placeholder="johndoe"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-700 transition-all"
                  autoComplete="username"
                />
              </div>
              <p className="text-xs text-neutral-600 mt-1.5">Letters, numbers, and underscores only</p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-700 transition-all"
                  autoComplete="new-password"
                />
              </div>
              
              {/* Password strength indicators */}
              {password && (
                <div className="mt-2 space-y-1">
                  <PasswordCheck checked={passwordChecks.length} label="At least 8 characters" />
                  <PasswordCheck checked={passwordChecks.hasLetter} label="Contains a letter" />
                  <PasswordCheck checked={passwordChecks.hasNumber} label="Contains a number" />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-700 transition-all"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isLoading}
              className="bg-white hover:bg-neutral-100 text-neutral-900 border-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className="text-neutral-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-white hover:text-neutral-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-neutral-600 text-sm mt-8">
          Carbon Border Adjustment Mechanism Filing
        </p>
      </motion.div>
    </div>
  )
}

function PasswordCheck({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
        checked ? 'bg-white/20 text-white' : 'bg-neutral-800 text-neutral-600'
      }`}>
        {checked && <Check className="w-3 h-3" />}
      </div>
      <span className={checked ? 'text-white' : 'text-neutral-600'}>{label}</span>
    </div>
  )
}
