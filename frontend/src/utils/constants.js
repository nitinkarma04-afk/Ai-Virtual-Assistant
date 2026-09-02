/**
 * Constants & Presets for Assistant Customization & Design System
 */

export const ASSISTANT_NAME_PRESETS = [
  'Jarvis',
  'Aria',
  'Nova',
  'Friday',
  'Atlas',
  'Kira',
  'Echo',
  'Zenith',
]

export const AVATAR_PRESETS = [
  {
    id: 'neural-orb',
    name: 'Neural Core',
    colorName: 'Cyan Electric',
    gradient: 'from-cyan-500 via-blue-600 to-indigo-600',
    ringColor: 'border-cyan-400/50',
    glowColor: 'shadow-cyan-500/40',
    bgGlow: 'bg-cyan-500/20',
    accent: '#06b6d4',
  },
  {
    id: 'quantum-pulse',
    name: 'Quantum Pulse',
    colorName: 'Nebula Violet',
    gradient: 'from-violet-500 via-purple-600 to-pink-600',
    ringColor: 'border-violet-400/50',
    glowColor: 'shadow-violet-500/40',
    bgGlow: 'bg-violet-500/20',
    accent: '#8b5cf6',
  },
  {
    id: 'cyber-matrix',
    name: 'Cyber Matrix',
    colorName: 'Matrix Emerald',
    gradient: 'from-emerald-400 via-teal-600 to-cyan-700',
    ringColor: 'border-emerald-400/50',
    glowColor: 'shadow-emerald-500/40',
    bgGlow: 'bg-emerald-500/20',
    accent: '#10b981',
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    colorName: 'Solar Amber',
    gradient: 'from-amber-400 via-orange-500 to-red-600',
    ringColor: 'border-amber-400/50',
    glowColor: 'shadow-amber-500/40',
    bgGlow: 'bg-amber-500/20',
    accent: '#f59e0b',
  },
  {
    id: 'hologram-prism',
    name: 'Hologram Prism',
    colorName: 'Prism Sky',
    gradient: 'from-sky-400 via-indigo-500 to-purple-600',
    ringColor: 'border-sky-400/50',
    glowColor: 'shadow-sky-500/40',
    bgGlow: 'bg-sky-500/20',
    accent: '#38bdf8',
  },
  {
    id: 'crimson-nova',
    name: 'Crimson Nova',
    colorName: 'Neon Rose',
    gradient: 'from-rose-500 via-pink-600 to-purple-700',
    ringColor: 'border-rose-400/50',
    glowColor: 'shadow-rose-500/40',
    bgGlow: 'bg-rose-500/20',
    accent: '#f43f5e',
  },
]

export const PERSONALITY_PRESETS = [
  {
    id: 'helpful',
    name: 'Helpful & Balanced',
    description: 'Polite, clear, supportive, and natural in conversation.',
    badge: 'Standard',
  },
  {
    id: 'concise',
    name: 'Fast & Concise',
    description: 'Direct, brief answers without filler or extra explanation.',
    badge: 'Productivity',
  },
  {
    id: 'technical',
    name: 'Technical & Analytical',
    description: 'Deep technical accuracy, structured logic, and code explanations.',
    badge: 'Engineering',
  },
  {
    id: 'witty',
    name: 'Witty & Expressive',
    description: 'Energetic personality with casual humor and vivid expression.',
    badge: 'Creative',
  },
]

export const WAKE_WORD_TEMPLATES = [
  'Hey {name}',
  'Listen {name}',
  'Activate {name}',
  'OK {name}',
]
