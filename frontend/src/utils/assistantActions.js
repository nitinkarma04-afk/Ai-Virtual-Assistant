/**
 * WEBSITE_ACTIONS
 * Defines supported websites with their base URL and optional search URL.
 * To add a new site: add an entry here with url (required) and searchUrl (optional).
 */
const WEBSITE_ACTIONS = {
  youtube: {
    name: 'YouTube',
    url: 'https://www.youtube.com',
    searchUrl: 'https://www.youtube.com/results?search_query=',
  },

  github: {
    name: 'GitHub',
    url: 'https://github.com',
    searchUrl: 'https://github.com/search?q=',
  },

  facebook: {
    name: 'Facebook',
    url: 'https://www.facebook.com',
  },

  instagram: {
    name: 'Instagram',
    url: 'https://www.instagram.com',
  },

  google: {
    name: 'Google',
    url: 'https://www.google.com',
    searchUrl: 'https://www.google.com/search?q=',
  },

  gmail: {
    name: 'Gmail',
    url: 'https://mail.google.com',
  },

  linkedin: {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com',
  },

  whatsapp: {
    name: 'WhatsApp',
    url: 'https://web.whatsapp.com',
  },

  reddit: {
    name: 'Reddit',
    url: 'https://www.reddit.com',
    searchUrl: 'https://www.reddit.com/search/?q=',
  },

  spotify: {
    name: 'Spotify',
    url: 'https://open.spotify.com',
    searchUrl: 'https://open.spotify.com/search/',
  },
}


// desktop-actions 
const DESKTOP_APP_ACTIONS = {
  vscode: {
    name: 'VS Code',
  },
  notepad: {
    name: 'Notepad',
  },
  calculator: {
    name: 'Calculator',
  },
}
// Joined site key list for use in regex patterns
const SITE_KEYS = Object.keys(WEBSITE_ACTIONS).join('|')

/**
 * Clean up a raw query string by removing leading connectors and
 * trailing Hindi action verbs so only the meaningful search term remains.
 * e.g. "for java dsa videos" -> "java dsa videos"
 *      "java dsa videos search karo" -> "java dsa videos"
 */
function cleanQuery(str) {
  if (!str) return ''
  return str
    .replace(/^(?:for|about|ke liye|pe|par|mein|me|mai)\s+/i, '')
    .replace(/\s+(?:search karo|search kijiye|dhundo|khojo|dikhao|karo|kijiye|batao)$/i, '')
    .replace(/[?.!,]+$/g, '')
    .trim()
}

/**
 * detectAssistantAction
 *
 * Parses a natural-language user command and returns a structured action object
 * if the command maps to a supported browser action, or null if it should be
 * handled by the AI chat system.
 *
 * Supported action types:
 *   - OPEN_WEBSITE  { type, target, name, url, command }
 *   - SEARCH_WEBSITE { type, target, name, query, url, command }
 *
 * Returns null for:
 *   - AI questions / explanations ("What is GitHub?", "Explain polymorphism")
 *   - Unsupported sites ("Open Netflix")
 *   - Normal conversation
 */
export function detectAssistantAction(command) {
  if (!command || typeof command !== 'string') return null

  const raw = command.trim()
  // Normalize: lowercase, strip trailing punctuation AND trailing "please" for matching
  const lower = raw
    .toLowerCase()
    .replace(/[?.!,]+$/, '')
    .replace(/\s+please\s*$/, '')
    .trim()



    // DESKTOP APP ACTION
  const desktopAppRx =
    /^(?:(?:can you|could you|would you|jarvis)\s+)?(?:please\s+)?(?:open|launch|start)\s+(?:the\s+)?(vscode|vs code|notepad|calculator)$/i

  const desktopAppMatch = lower.match(desktopAppRx)

  if (desktopAppMatch) {
    const appKey = desktopAppMatch[1]
      .toLowerCase()
      .replace(/\s+/g, '')

    const app = DESKTOP_APP_ACTIONS[appKey]

    if (app) {
      return {
        type: 'DESKTOP_ACTION',
        action: 'OPEN_APP',
        target: appKey,
        name: app.name,
        command: raw,
      }
    }
  }
  // ----------------------------------------------------------------
  // GUARD: Explicit AI-question patterns must NEVER trigger actions.
  // These questions mention a site name but are clearly conversational.
  // Only bypass if the command starts with a polite action prefix.
  // ----------------------------------------------------------------
  const isPoliteAction =
    /^(?:(?:can you|could you|would you|jarvis)\s+)?(?:please\s+)?(?:open|launch|start|visit|go to|take me to|search|find)\b/i.test(
      lower
    ) ||
    /^(?:can you|could you|would you|jarvis)\s+(?:please\s+)?(?:open|launch|start|visit|go to|take me to|search|find)\b/i.test(
      lower
    )

  if (!isPoliteAction) {
    if (
      /^(?:explain|why|what is|what are|what does|who|describe|discuss|tell me about)\b/i.test(
        lower
      ) ||
      /\bhow (?:[a-z0-9\s]+)?works?\b/i.test(lower) ||
      /\bwhy (?:is|are|should|does) (?:[a-z0-9\s]+)?(?:popular|famous|used|better|good|bad|important)\b/i.test(
        lower
      )
    ) {
      return null
    }
  }

  // ================================================================
  // SECTION A: OPEN INTENT (evaluated first to prevent preposition
  // patterns like "youtube par jao" from being parsed as searches)
  // ================================================================

  // A1. English open commands (single-site, no trailing query)
  // Supports: "open youtube", "launch github", "go to youtube",
  //           "take me to youtube", "visit youtube",
  //           "can you open youtube", "please open github"
  const englishOpenRx = new RegExp(
    `^(?:(?:can you|could you|would you|jarvis)\\s+)?(?:please\\s+)?` +
      `(?:open|launch|start|visit|go to|take me to|navigate to)` +
      `\\s+(?:the\\s+)?(${SITE_KEYS})$`,
    'i'
  )
  const englishOpenMatch = lower.match(englishOpenRx)
  if (englishOpenMatch) {
    const siteKey = englishOpenMatch[1].toLowerCase()
    const site = WEBSITE_ACTIONS[siteKey]
    return {
      type: 'OPEN_WEBSITE',
      target: siteKey,
      name: site.name,
      url: site.url,
      command: raw,
    }
  }

  // A2. Hinglish open commands (no trailing query)
  // Supports: "youtube kholo", "youtube khol do", "youtube open karo",
  //           "mujhe youtube le chalo", "youtube par jao",
  //           "youtube chalao", "mujhe youtube kholo", "gmail kholo"
  const hinglishOpenRx = new RegExp(
    `^(?:mujhe\\s+)?(${SITE_KEYS})` +
      `(?:\\s+(?:kholo|khol do|kholna|kholiye|open karo|open kar do|open kardo|` +
      `chalao|chala do|le chalo|par jao|pe jao))$`,
    'i'
  )
  const hinglishOpenMatch = lower.match(hinglishOpenRx)
  if (hinglishOpenMatch) {
    const siteKey = hinglishOpenMatch[1].toLowerCase()
    const site = WEBSITE_ACTIONS[siteKey]
    return {
      type: 'OPEN_WEBSITE',
      target: siteKey,
      name: site.name,
      url: site.url,
      command: raw,
    }
  }

  // A3. Malformed/bare search commands → graceful OPEN fallback
  // "search youtube" (no query) → open YouTube
  // "youtube search karo" (no query) → open YouTube
  const malformedSearchRx = new RegExp(
    `^(?:(?:search\\s+(${SITE_KEYS}))|(${SITE_KEYS})\\s+(?:search karo|search kijiye|search))$`,
    'i'
  )
  const malformedSearchMatch = lower.match(malformedSearchRx)
  if (malformedSearchMatch) {
    const siteKey = (malformedSearchMatch[1] || malformedSearchMatch[2]).toLowerCase()
    const site = WEBSITE_ACTIONS[siteKey]
    return {
      type: 'OPEN_WEBSITE',
      target: siteKey,
      name: site.name,
      url: site.url,
      command: raw,
    }
  }

  // ================================================================
  // SECTION B: SEARCH INTENT
  // ================================================================

  // B1. "find/search [for] {query} on/in {website}"
  // e.g. "find java dsa videos on youtube"
  //      "search for java dsa videos on youtube"
  const findOnRx = new RegExp(
    `^(?:please\\s+)?(?:search(?:\\s+for)?|find|look up)\\s+(.+?)\\s+(?:on|in)\\s+(${SITE_KEYS})$`,
    'i'
  )
  const findOnMatch = lower.match(findOnRx)
  if (findOnMatch) {
    const q = cleanQuery(findOnMatch[1])
    const siteKey = findOnMatch[2].toLowerCase()
    const site = WEBSITE_ACTIONS[siteKey]
    if (q && site.searchUrl) {
      return {
        type: 'SEARCH_WEBSITE',
        target: siteKey,
        name: site.name,
        query: q,
        url: site.searchUrl + encodeURIComponent(q),
        command: raw,
      }
    }
    // Query is empty → open site
    return {
      type: 'OPEN_WEBSITE',
      target: siteKey,
      name: site.name,
      url: site.url,
      command: raw,
    }
  }

  // B2. Hinglish search: "{website} par/pe/mein {query} [search karo/dhundo]"
  // e.g. "youtube par java dsa videos search karo"
  //      "youtube pe java tutorial dhundo"
  //      "google par react tutorial search karo"
  const hinglishSearchRx = new RegExp(
    `^(${SITE_KEYS})\\s+(?:par|pe|mein|me|mai)\\s+(.+?)` +
      `(?:\\s+(?:search karo|search kijiye|dhundo|khojo|dekho|dikhao))?$`,
    'i'
  )
  const hinglishSearchMatch = lower.match(hinglishSearchRx)
  if (hinglishSearchMatch) {
    const siteKey = hinglishSearchMatch[1].toLowerCase()
    const site = WEBSITE_ACTIONS[siteKey]
    const q = cleanQuery(hinglishSearchMatch[2])
    // Exclude navigation-only words ("jao") that are handled above as OPEN
    const navWords = new Set(['jao', 'ao', 'jana'])
    if (q && site.searchUrl && !navWords.has(q.toLowerCase())) {
      return {
        type: 'SEARCH_WEBSITE',
        target: siteKey,
        name: site.name,
        query: q,
        url: site.searchUrl + encodeURIComponent(q),
        command: raw,
      }
    }
  }

  // B3. "search {website} for {query}" / "open search {website} for {query}"
  // e.g. "search youtube for comedy videos"
  //      "open search youtube for dsa video"
  const searchForRx = new RegExp(
    `^(?:(?:can you|could you|please|jarvis)\\s+)?(?:(?:open\\s+)?search)` +
      `\\s+(${SITE_KEYS})(?:\\s+(?:for|about)\\s+(.+))?$`,
    'i'
  )
  const searchForMatch = lower.match(searchForRx)
  if (searchForMatch) {
    const siteKey = searchForMatch[1].toLowerCase()
    const site = WEBSITE_ACTIONS[siteKey]
    const q = cleanQuery(searchForMatch[2])
    if (q && site.searchUrl) {
      return {
        type: 'SEARCH_WEBSITE',
        target: siteKey,
        name: site.name,
        query: q,
        url: site.searchUrl + encodeURIComponent(q),
        command: raw,
      }
    }
    // No query → graceful open
    return {
      type: 'OPEN_WEBSITE',
      target: siteKey,
      name: site.name,
      url: site.url,
      command: raw,
    }
  }

  // B4. "open {website} {query}" — open with a trailing query becomes search
  // e.g. "open youtube dsa video"
  const openWithQueryRx = new RegExp(
    `^(?:(?:can you|could you|please|jarvis)\\s+)?(?:open|launch)` +
      `\\s+(${SITE_KEYS})\\s+(.+)$`,
    'i'
  )
  const openWithQueryMatch = lower.match(openWithQueryRx)
  if (openWithQueryMatch) {
    const siteKey = openWithQueryMatch[1].toLowerCase()
    const site = WEBSITE_ACTIONS[siteKey]
    const q = cleanQuery(openWithQueryMatch[2])
    if (q && site.searchUrl) {
      return {
        type: 'SEARCH_WEBSITE',
        target: siteKey,
        name: site.name,
        query: q,
        url: site.searchUrl + encodeURIComponent(q),
        command: raw,
      }
    }
  }

  // No recognized action — let normal AI chat handle this
  return null
}

/**
 * executeAssistantAction
 * Opens the resolved URL in a new browser tab.
 * Returns true if executed, false if action is null or unknown.
 */
export function executeAssistantAction(action) {
  if (!action) return false

  switch (action.type) {
    case 'OPEN_WEBSITE':
      window.open(action.url, '_blank', 'noopener,noreferrer')
      return true

    case 'SEARCH_WEBSITE':
      window.open(action.url, '_blank', 'noopener,noreferrer')
      return true

    default:
      return false
  }
}