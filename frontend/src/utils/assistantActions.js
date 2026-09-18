const WEBSITE_ACTIONS = {
  youtube: {
    name: "YouTube",
    url: "https://www.youtube.com",
    searchUrl: "https://www.youtube.com/results?search_query=",
  },

  github: {
    name: "GitHub",
    url: "https://github.com",
    searchUrl: "https://github.com/search?q=",
  },

  facebook: {
    name: "Facebook",
    url: "https://www.facebook.com",
  },

  instagram: {
    name: "Instagram",
    url: "https://www.instagram.com",
  },

  google: {
    name: "Google",
    url: "https://www.google.com",
    searchUrl: "https://www.google.com/search?q=",
  },

  gmail: {
    name: "Gmail",
    url: "https://mail.google.com",
  },

  linkedin: {
    name: "LinkedIn",
    url: "https://www.linkedin.com",
  },

  whatsapp: {
    name: "WhatsApp",
    url: "https://web.whatsapp.com",
  },

  reddit: {
    name: "Reddit",
    url: "https://www.reddit.com",
    searchUrl: "https://www.reddit.com/search/?q=",
  },

  spotify: {
    name: "Spotify",
    url: "https://open.spotify.com",
    searchUrl: "https://open.spotify.com/search/",
  },
}

const OPEN_KEYWORDS = [
  "open",
  "launch",
  "start",
  "go to",
  "take me to",
  "visit",
]

const SEARCH_KEYWORDS = [
  "search",
  "find",
]

const CONNECTOR_WORDS = [
  "for",
  "on",
  "in",
  "at",
  "and",
]

/**
 * Remove unnecessary words from a command
 * so that only the actual search query remains.
 */
function extractSearchQuery(command, websiteKey) {
  let query = command.toLowerCase().trim()

  // Remove search keywords
  for (const keyword of SEARCH_KEYWORDS) {
    query = query.replace(
      new RegExp(`\\b${keyword}\\b`, "g"),
      ""
    )
  }

  // Remove open keywords
  for (const keyword of OPEN_KEYWORDS) {
    query = query.replace(
      new RegExp(`\\b${keyword}\\b`, "g"),
      ""
    )
  }

  // Remove website name
  query = query.replace(
    new RegExp(`\\b${websiteKey}\\b`, "g"),
    ""
  )

  // Remove connector words
  for (const keyword of CONNECTOR_WORDS) {
    query = query.replace(
      new RegExp(`\\b${keyword}\\b`, "g"),
      ""
    )
  }

  // Remove common phrase used between commands
  query = query.replace(
    /\bto\b/g,
    ""
  )

  query = query.replace(
    /\s+/g,
    " "
  ).trim()

  return query
}

/**
 * Detect an assistant action from a user command.
 */
export function detectAssistantAction(command) {
  if (!command || typeof command !== "string") {
    return null
  }

  const text = command.toLowerCase().trim()

  // --------------------------------------------------
  // 1. Check websites
  // --------------------------------------------------

  for (const [key, website] of Object.entries(WEBSITE_ACTIONS)) {
    if (!text.includes(key)) {
      continue
    }

    // ------------------------------------------------
    // 2. Detect whether command contains search intent
    // ------------------------------------------------

    const hasSearchKeyword = SEARCH_KEYWORDS.some(
      (keyword) => text.includes(keyword)
    )

    // ------------------------------------------------
    // 3. Extract possible query
    // ------------------------------------------------

    const query = extractSearchQuery(
      command,
      key
    )

    // ------------------------------------------------
    // 4. SEARCH WEBSITE
    // ------------------------------------------------

    if (website.searchUrl && (hasSearchKeyword || query)) {
      /*
       * Example:
       *
       * "search youtube for comedy videos"
       *          ↓
       * query = "comedy videos"
       *
       * "open youtube dsa video"
       *          ↓
       * query = "dsa video"
       */

      if (query) {
        return {
          type: "SEARCH_WEBSITE",
          target: key,
          name: website.name,
          query,
          url: `${website.searchUrl}${encodeURIComponent(query)}`,
          command,
        }
      }
    }

    // ------------------------------------------------
    // 5. OPEN WEBSITE
    // ------------------------------------------------

    const hasOpenCommand = OPEN_KEYWORDS.some(
      (keyword) => text.includes(keyword)
    )

    if (hasOpenCommand) {
      return {
        type: "OPEN_WEBSITE",
        target: key,
        name: website.name,
        url: website.url,
        command,
      }
    }
  }

  return null
}

/**
 * Execute detected assistant action.
 */
export function executeAssistantAction(action) {
  if (!action) {
    return false
  }

  switch (action.type) {
    case "OPEN_WEBSITE":
      window.open(
        action.url,
        "_blank",
        "noopener,noreferrer"
      )

      return true

    case "SEARCH_WEBSITE":
      window.open(
        action.url,
        "_blank",
        "noopener,noreferrer"
      )

      return true

    default:
      return false
  }
}