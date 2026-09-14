import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  ArrowLeft,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  Code2,
  Heart,
  FileText,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { profileService, getErrorMessage } from '../../services/api'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

export const ProfilePage = () => {
  const { user } = useAuth()

  const [hasProfile, setHasProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Profile form fields
  const [bio, setBio] = useState('')
  const [role, setRole] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [interestsInput, setInterestsInput] = useState('')
  const [location, setLocation] = useState('')

  // Fetch profile from backend
  const fetchProfile = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const data = await profileService.getProfile()
      if (data?.profile) {
        setHasProfile(true)
        setBio(data.profile.bio || '')
        setRole(data.profile.role || '')
        setSkillsInput(Array.isArray(data.profile.skills) ? data.profile.skills.join(', ') : '')
        setInterestsInput(Array.isArray(data.profile.interests) ? data.profile.interests.join(', ') : '')
        setLocation(data.profile.location || '')
      } else {
        setHasProfile(false)
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setHasProfile(false)
      } else {
        console.error('Failed to fetch profile:', err)
        setError(getErrorMessage(err))
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    profileService
      .getProfile()
      .then((data) => {
        if (!isMounted) return
        if (data?.profile) {
          setHasProfile(true)
          setBio(data.profile.bio || '')
          setRole(data.profile.role || '')
          setSkillsInput(Array.isArray(data.profile.skills) ? data.profile.skills.join(', ') : '')
          setInterestsInput(Array.isArray(data.profile.interests) ? data.profile.interests.join(', ') : '')
          setLocation(data.profile.location || '')
        } else {
          setHasProfile(false)
        }
      })
      .catch((err) => {
        if (!isMounted) return
        if (err.response?.status === 404) {
          setHasProfile(false)
        } else {
          setError(getErrorMessage(err))
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Auto-dismiss success notification
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Handle Profile Save / Update
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)

    const parseTags = (str) =>
      str
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

    const payload = {
      bio: bio.trim(),
      role: role.trim(),
      skills: parseTags(skillsInput),
      interests: parseTags(interestsInput),
      location: location.trim(),
    }

    try {
      if (hasProfile) {
        await profileService.updateProfile(payload)
      } else {
        await profileService.createProfile(payload)
        setHasProfile(true)
      }
      setSuccessMessage('Profile saved successfully!')
    } catch (err) {
      console.error('Failed to save profile:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* Ambient Lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full px-4 sm:px-6 py-4 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                className="text-slate-400 hover:text-white"
                title="Return to Dashboard"
              >
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>

            <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight leading-none">
                  User Profile
                </h1>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {user?.name || user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={RefreshCw}
              onClick={() => fetchProfile(true)}
              disabled={isLoading}
              title="Refresh profile"
              className="text-slate-400 hover:text-cyan-300"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6">
        {/* User Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-500/10">
              <User className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {user?.name || 'Neural User'}
                </h2>
                <Badge variant="cyan" className="text-[10px]">
                  Verified Session
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <strong className="font-semibold block text-rose-200">Error Loading/Saving Profile</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Profile Form */}
        {isLoading ? (
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 animate-pulse space-y-6">
            <div className="h-6 w-32 bg-slate-800 rounded" />
            <div className="space-y-4">
              <div className="h-10 w-full bg-slate-800/60 rounded-xl" />
              <div className="h-20 w-full bg-slate-800/60 rounded-xl" />
              <div className="h-10 w-full bg-slate-800/60 rounded-xl" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Personal & Professional Context</h3>
                <p className="text-xs text-slate-400">
                  This background profile is used by your assistant to tailor contextual responses.
                </p>
              </div>
              <Badge variant="cyan" className="text-[10px]">
                {hasProfile ? 'Profile Active' : 'New Profile'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  Role / Occupation
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Full-Stack Developer, Student, Data Scientist"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA or London, UK"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
                />
              </div>

              {/* Skills */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Skills & Expertise (Comma-separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. JavaScript, React, Node.js, Python, UI Design"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
                />
              </div>

              {/* Interests */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-cyan-400" />
                  Interests & Topics (Comma-separated)
                </label>
                <input
                  type="text"
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  placeholder="e.g. Artificial Intelligence, Robotics, Sci-Fi Novels, Chess"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  Personal Bio / Summary
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief overview of yourself and how you like your assistant to interact with you..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-800/80">
              <Button variant="glow" type="submit" disabled={isSaving} icon={isSaving ? Loader2 : Save}>
                {isSaving ? 'Saving Changes...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center text-xs text-slate-600 font-mono border-t border-slate-900 mt-12 relative z-10">
        User Profile Management
      </footer>
    </div>
  )
}

export default ProfilePage

