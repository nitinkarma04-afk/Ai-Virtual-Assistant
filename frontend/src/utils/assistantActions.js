/**
 * assistantActions.js
 *
 * Handles:
 * 1. Website actions
 * 2. Website search actions
 * 3. Desktop actions
 *
 * Desktop actions:
 * - OPEN_APP
 * - OPEN_URL
 * - OPEN_FILE
 * - SCREENSHOT
 * - VOLUME_UP
 * - VOLUME_DOWN
 * - MUTE
 * - MEDIA_PLAY_PAUSE
 * - SHUTDOWN
 * - RESTART
 * - LOCK
 */

// ================================================================
// WEBSITE ACTIONS
// ================================================================

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


// ================================================================
// DESKTOP APP ACTIONS
// ================================================================

const DESKTOP_APP_ACTIONS = {
  vscode: {
    name: 'VS Code',
    target: 'vscode',
  },

  notepad: {
    name: 'Notepad',
    target: 'notepad',
  },

  calculator: {
    name: 'Calculator',
    target: 'calculator',
  },

  chrome: {
    name: 'Chrome',
    target: 'chrome',
  },
}


// ================================================================
// DESKTOP COMMAND NAMES
// ================================================================

const DESKTOP_ACTION_NAMES = {
  VOLUME_UP: 'Volume up',
  VOLUME_DOWN: 'Volume down',
  MUTE: 'Mute',
  MEDIA_PLAY_PAUSE: 'Play/Pause',
  SCREENSHOT: 'Screenshot',
  LOCK: 'Locking computer',
  SHUTDOWN: 'Shutting down computer',
  RESTART: 'Restarting computer',
}


// ================================================================
// WEBSITE KEYS
// ================================================================

const SITE_KEYS = Object.keys(WEBSITE_ACTIONS).join('|')


// ================================================================
// CLEAN SEARCH QUERY
// ================================================================

function cleanQuery(str) {
  if (!str) return ''

  return str
    .replace(
      /^(?:for|about|ke liye|pe|par|mein|me|mai)\s+/i,
      ''
    )
    .replace(
      /\s+(?:search karo|search kijiye|dhundo|khojo|dikhao|karo|kijiye|batao)$/i,
      ''
    )
    .replace(/[?.!,]+$/g, '')
    .trim()
}


// ================================================================
// DESKTOP ACTION BUILDER
// ================================================================

function createDesktopAction(
  action,
  name,
  command,
  target = null
) {
  return {
    type: 'DESKTOP_ACTION',
    action,
    target,
    name,
    command,
  }
}


// ================================================================
// DETECT DESKTOP ACTION
// ================================================================
//
// Important:
// This function uses action context + keywords.
// It does NOT trigger simply because a random sentence contains
// words like "screenshot", "volume", etc.
//
// ================================================================

function detectDesktopAction(raw, lower) {
  // ------------------------------------------------
  // Common polite prefixes
  // ------------------------------------------------

  const prefix =
    '(?:(?:hey\\s+)?(?:can you|could you|would you|will you|please|jarvis)\\s+)?'

  const please =
    '(?:please\\s+)?'


  // ================================================================
  // 1. OPEN DESKTOP APP
  // ================================================================
  //
  // Examples:
  // open vscode
  // open vs code
  // vscode kholo
  // vs code open karo
  // mujhe vscode kholo
  // launch notepad
  // calculator chalao
  // chrome start karo
  //
  // ================================================================

  const appNamePattern =
    '(vscode|vs code|notepad|calculator|chrome)'

  const openAppRx = new RegExp(
    `^${prefix}${please}(?:open|launch|start|run)\\s+(?:the\\s+)?${appNamePattern}$`,
    'i'
  )

  const openAppMatch = lower.match(openAppRx)

  const hinglishAppRx = new RegExp(
    `^(?:mujhe\\s+)?${appNamePattern}\\s+(?:kholo|khol do|kholna|open karo|open kar do|open kardo|` +
      `chalao|chala do|start karo|launch karo|shuru karo)$`,
    'i'
  )

  const hinglishAppMatch = lower.match(hinglishAppRx)

  const appMatch = openAppMatch || hinglishAppMatch

  if (appMatch) {
    const appKey = appMatch[1]
      .toLowerCase()
      .replace(/\s+/g, '')

    const app = DESKTOP_APP_ACTIONS[appKey]

    if (app) {
      return createDesktopAction(
        'OPEN_APP',
        app.name,
        raw,
        app.target
      )
    }
  }


  // ================================================================
  // 2. OPEN FILE / FOLDER
  // ================================================================
  //
  // Examples:
  // open file C:\Users\Nitin\Desktop\test.txt
  // open the file C:\...
  // file kholo C:\...
  // folder kholo C:\...
  // open folder C:\...
  //
  // ================================================================

  const openFileRx = new RegExp(
    `^${prefix}${please}(?:open|launch)\\s+(?:the\\s+)?(?:file|folder)\\s+(.+)$`,
    'i'
  )

  const openFileMatch = raw.match(openFileRx)

  if (openFileMatch) {
    const filePath = openFileMatch[1]
      .trim()
      .replace(/^["']|["']$/g, '')

    if (filePath) {
      return createDesktopAction(
        'OPEN_FILE',
        'File',
        raw,
        filePath
      )
    }
  }

  const hinglishFileRx =
    /^(?:please\s+)?(?:file|folder)\s+(?:kholo|khol do|open karo|open kar do)\s+(.+)$/i

  const hinglishFileMatch = raw.match(hinglishFileRx)

  if (hinglishFileMatch) {
    const filePath = hinglishFileMatch[1]
      .trim()
      .replace(/^["']|["']$/g, '')

    if (filePath) {
      return createDesktopAction(
        'OPEN_FILE',
        'File',
        raw,
        filePath
      )
    }
  }


  // ================================================================
  // 3. OPEN URL
  // ================================================================
  //
  // Examples:
  // open https://example.com
  // open url https://example.com
  // visit https://example.com
  //
  // ================================================================

  const openUrlRx = new RegExp(
    `^${prefix}${please}(?:open|launch|visit|go to)\\s+(?:url\\s+)?(https?:\\/\\/\\S+)$`,
    'i'
  )

  const openUrlMatch = raw.match(openUrlRx)

  if (openUrlMatch) {
    const url = openUrlMatch[1].trim()

    return {
      type: 'DESKTOP_ACTION',
      action: 'OPEN_URL',
      target: url,
      name: 'Website',
      url,
      command: raw,
    }
  }


  // ================================================================
  // 4. SCREENSHOT
  // ================================================================
  //
  // English:
  // take screenshot
  // take a screenshot
  // capture screen
  // capture my screen
  // take screen shot
  //
  // Hinglish:
  // screenshot lo
  // screenshot le lo
  // screenshot lelo
  // screenshot le kar do
  // screen ka screenshot lo
  // meri screen ka screenshot le lo
  // screen capture karo
  // screen ki photo lo
  //
  // ================================================================

  const screenshotRx =
    /^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:take\s+(?:a\s+)?)?(?:my\s+)?(?:screenshot|screen\s*shot)(?:\s+(?:lo|lelo|le\s+lo|le\s+lelo|le\s+kar\s+do|lena|karo|kar\s+do))?$|^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:capture|take)\s+(?:the\s+|my\s+)?screen(?:\s+(?:lo|karo|kar\s+do))?$|^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:screen\s+capture|screen\s+ki\s+photo)(?:\s+(?:lo|lelo|le\s+lo|karo|kar\s+do))?$/i

  if (screenshotRx.test(lower)) {
    return createDesktopAction(
      'SCREENSHOT',
      DESKTOP_ACTION_NAMES.SCREENSHOT,
      raw
    )
  }


  // ================================================================
  // 5. VOLUME UP
  // ================================================================
  //
  // English:
  // volume up
  // increase volume
  // turn up volume
  // make volume louder
  // increase sound
  //
  // Hinglish:
  // volume badha do
  // volume badhao
  // awaaz badha do
  // sound badha do
  // awaaz tez karo
  //
  // ================================================================

  const volumeUpRx =
    /^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:volume\s+(?:up|increase|increased|higher|badha|badhao|badha\s+do|badhado)|increase\s+(?:the\s+)?(?:volume|sound|audio)|turn\s+(?:the\s+)?(?:volume|sound)\s+up|make\s+(?:the\s+)?(?:volume|sound)\s+(?:louder|higher)|(?:awaaz|sound)\s+(?:badha|badhao|badha\s+do|badhado|tez\s+karo|tez\s+kar\s+do))$/i

  if (volumeUpRx.test(lower)) {
    return createDesktopAction(
      'VOLUME_UP',
      DESKTOP_ACTION_NAMES.VOLUME_UP,
      raw
    )
  }


  // ================================================================
  // 6. VOLUME DOWN
  // ================================================================

  const volumeDownRx =
    /^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:volume\s+(?:down|decrease|decreased|lower|kam|kam\s+karo|kam\s+kar\s+do|ghatao|ghata\s+do)|decrease\s+(?:the\s+)?(?:volume|sound|audio)|turn\s+(?:the\s+)?(?:volume|sound)\s+down|make\s+(?:the\s+)?(?:volume|sound)\s+(?:lower|quieter)|(?:awaaz|sound)\s+(?:kam|kam\s+karo|kam\s+kar\s+do|ghatao|ghata\s+do))$/i

  if (volumeDownRx.test(lower)) {
    return createDesktopAction(
      'VOLUME_DOWN',
      DESKTOP_ACTION_NAMES.VOLUME_DOWN,
      raw
    )
  }


  // ================================================================
  // 7. MUTE
  // ================================================================
  //
  // ================================================================

  const muteRx =
    /^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:mute|mute\s+(?:the\s+)?(?:volume|sound|audio)|(?:awaaz|sound)\s+mute(?:\s+karo|\s+kar\s+do)?|sound\s+off\s+karo|volume\s+off\s+karo)$/i

  if (muteRx.test(lower)) {
    return createDesktopAction(
      'MUTE',
      DESKTOP_ACTION_NAMES.MUTE,
      raw
    )
  }


  // ================================================================
  // 8. MEDIA PLAY / PAUSE
  // ================================================================
  //
  // ================================================================

  const mediaRx =
    /^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:play\s*\/?\s*pause|media\s+play\s*\/?\s*pause|play\s+pause|pause\s+(?:music|media|song)|resume\s+(?:music|media|song)|play\s+(?:music|media|song)|music\s+(?:play|pause)|song\s+(?:play|pause))$/i

  if (mediaRx.test(lower)) {
    return createDesktopAction(
      'MEDIA_PLAY_PAUSE',
      DESKTOP_ACTION_NAMES.MEDIA_PLAY_PAUSE,
      raw
    )
  }


  // ================================================================
  // 9. LOCK COMPUTER
  // ================================================================
  //
  // English:
  // lock computer
  // lock my pc
  // lock my computer
  // lock laptop
  //
  // Hinglish:
  // mere pc ko lock karo
  // mere pc ko lock kar do
  // computer lock karo
  // laptop lock kar do
  // mera system lock karo
  //
  // ================================================================

  const lockRx =
    /^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:lock\s+(?:the\s+|my\s+)?(?:computer|pc|laptop|system)|(?:my\s+|mere\s+|mera\s+)?(?:computer|pc|laptop|system)\s+ko\s+lock\s+(?:karo|kar\s+do|kardo)|(?:computer|pc|laptop|system)\s+lock\s+(?:karo|kar\s+do|kardo))$/i

  if (lockRx.test(lower)) {
    return createDesktopAction(
      'LOCK',
      DESKTOP_ACTION_NAMES.LOCK,
      raw
    )
  }


  // ================================================================
  // 10. SHUTDOWN
  // ================================================================
  //
  // Kept intentionally stricter because this is destructive.
  //
  // ================================================================

  const shutdownRx =
    /^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:shutdown|shut\s+down)\s+(?:the\s+|my\s+)?(?:computer|pc|laptop|system)$|^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:my\s+|mere\s+|mera\s+)?(?:computer|pc|laptop|system)\s+(?:ko\s+)?shutdown\s+(?:karo|kar\s+do|kardo)$/i

  if (shutdownRx.test(lower)) {
    return createDesktopAction(
      'SHUTDOWN',
      DESKTOP_ACTION_NAMES.SHUTDOWN,
      raw
    )
  }


  // ================================================================
  // 11. RESTART
  // ================================================================
  //
  // Kept intentionally stricter because this is destructive.
  //
  // ================================================================

  const restartRx =
    /^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:restart|reboot)\s+(?:the\s+|my\s+)?(?:computer|pc|laptop|system)$|^(?:(?:hey\s+)?(?:can you|could you|would you|will you|please|jarvis)\s+)?(?:please\s+)?(?:my\s+|mere\s+|mera\s+)?(?:computer|pc|laptop|system)\s+(?:ko\s+)?(?:restart|reboot)\s+(?:karo|kar\s+do|kardo)$/i

  if (restartRx.test(lower)) {
    return createDesktopAction(
      'RESTART',
      DESKTOP_ACTION_NAMES.RESTART,
      raw
    )
  }


  return null
}


// ================================================================
// DETECT ASSISTANT ACTION
// ================================================================

export function detectAssistantAction(command) {
  if (!command || typeof command !== 'string') {
    return null
  }

  const raw = command.trim()

  const lower = raw
    .toLowerCase()
    .replace(/[?.!,]+$/, '')
    .replace(/\s+please\s*$/, '')
    .trim()


  // ================================================================
  // DESKTOP ACTIONS
  // ================================================================
  //
  // IMPORTANT:
  // Desktop actions are checked first so explicit OS commands
  // don't fall through into normal AI chat.
  //
  // ================================================================

  const desktopAction = detectDesktopAction(
    raw,
    lower
  )

  if (desktopAction) {
    return desktopAction
  }


  // ================================================================
  // AI QUESTION GUARD
  // ================================================================
  //
  // Website names mentioned in normal questions should NOT trigger
  // browser actions.
  //
  // Example:
  // "What is GitHub?"
  // "Explain YouTube"
  //
  // ================================================================

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
  // SECTION A: OPEN WEBSITE
  // ================================================================

  // ------------------------------------------------
  // A1. English open commands
  // ------------------------------------------------

  const englishOpenRx = new RegExp(
    `^(?:(?:can you|could you|would you|jarvis)\\s+)?(?:please\\s+)?` +
      `(?:open|launch|start|visit|go to|take me to|navigate to)` +
      `\\s+(?:the\\s+)?(${SITE_KEYS})$`,
    'i'
  )

  const englishOpenMatch = lower.match(
    englishOpenRx
  )

  if (englishOpenMatch) {
    const siteKey =
      englishOpenMatch[1].toLowerCase()

    const site =
      WEBSITE_ACTIONS[siteKey]

    return {
      type: 'OPEN_WEBSITE',
      target: siteKey,
      name: site.name,
      url: site.url,
      command: raw,
    }
  }


  // ------------------------------------------------
  // A2. Hinglish open commands
  // ------------------------------------------------

  const hinglishOpenRx = new RegExp(
    `^(?:mujhe\\s+)?(${SITE_KEYS})` +
      `(?:\\s+(?:kholo|khol do|kholna|kholiye|open karo|open kar do|open kardo|` +
      `chalao|chala do|le chalo|par jao|pe jao))$`,
    'i'
  )

  const hinglishOpenMatch = lower.match(
    hinglishOpenRx
  )

  if (hinglishOpenMatch) {
    const siteKey =
      hinglishOpenMatch[1].toLowerCase()

    const site =
      WEBSITE_ACTIONS[siteKey]

    return {
      type: 'OPEN_WEBSITE',
      target: siteKey,
      name: site.name,
      url: site.url,
      command: raw,
    }
  }


  // ------------------------------------------------
  // A3. Malformed / bare search commands
  // ------------------------------------------------

  const malformedSearchRx = new RegExp(
    `^(?:(?:search\\s+(${SITE_KEYS}))|(${SITE_KEYS})\\s+(?:search karo|search kijiye|search))$`,
    'i'
  )

  const malformedSearchMatch =
    lower.match(malformedSearchRx)

  if (malformedSearchMatch) {
    const siteKey = (
      malformedSearchMatch[1] ||
      malformedSearchMatch[2]
    ).toLowerCase()

    const site =
      WEBSITE_ACTIONS[siteKey]

    return {
      type: 'OPEN_WEBSITE',
      target: siteKey,
      name: site.name,
      url: site.url,
      command: raw,
    }
  }


  // ================================================================
  // SECTION B: WEBSITE SEARCH
  // ================================================================

  // ------------------------------------------------
  // B1. Search / find query on website
  // ------------------------------------------------

  const findOnRx = new RegExp(
    `^(?:please\\s+)?(?:search(?:\\s+for)?|find|look up)\\s+(.+?)\\s+(?:on|in)\\s+(${SITE_KEYS})$`,
    'i'
  )

  const findOnMatch =
    lower.match(findOnRx)

  if (findOnMatch) {
    const q =
      cleanQuery(findOnMatch[1])

    const siteKey =
      findOnMatch[2].toLowerCase()

    const site =
      WEBSITE_ACTIONS[siteKey]

    if (q && site.searchUrl) {
      return {
        type: 'SEARCH_WEBSITE',
        target: siteKey,
        name: site.name,
        query: q,
        url:
          site.searchUrl +
          encodeURIComponent(q),
        command: raw,
      }
    }

    return {
      type: 'OPEN_WEBSITE',
      target: siteKey,
      name: site.name,
      url: site.url,
      command: raw,
    }
  }


  // ------------------------------------------------
  // B2. Hinglish search
  // ------------------------------------------------

  const hinglishSearchRx = new RegExp(
    `^(${SITE_KEYS})\\s+(?:par|pe|mein|me|mai)\\s+(.+?)` +
      `(?:\\s+(?:search karo|search kijiye|dhundo|khojo|dekho|dikhao))?$`,
    'i'
  )

  const hinglishSearchMatch =
    lower.match(hinglishSearchRx)

  if (hinglishSearchMatch) {
    const siteKey =
      hinglishSearchMatch[1].toLowerCase()

    const site =
      WEBSITE_ACTIONS[siteKey]

    const q =
      cleanQuery(hinglishSearchMatch[2])

    const navWords = new Set([
      'jao',
      'ao',
      'jana',
    ])

    if (
      q &&
      site.searchUrl &&
      !navWords.has(q.toLowerCase())
    ) {
      return {
        type: 'SEARCH_WEBSITE',
        target: siteKey,
        name: site.name,
        query: q,
        url:
          site.searchUrl +
          encodeURIComponent(q),
        command: raw,
      }
    }
  }


  // ------------------------------------------------
  // B3. Search website for query
  // ------------------------------------------------

  const searchForRx = new RegExp(
    `^(?:(?:can you|could you|please|jarvis)\\s+)?(?:(?:open\\s+)?search)` +
      `\\s+(${SITE_KEYS})(?:\\s+(?:for|about)\\s+(.+))?$`,
    'i'
  )

  const searchForMatch =
    lower.match(searchForRx)

  if (searchForMatch) {
    const siteKey =
      searchForMatch[1].toLowerCase()

    const site =
      WEBSITE_ACTIONS[siteKey]

    const q =
      cleanQuery(searchForMatch[2])

    if (q && site.searchUrl) {
      return {
        type: 'SEARCH_WEBSITE',
        target: siteKey,
        name: site.name,
        query: q,
        url:
          site.searchUrl +
          encodeURIComponent(q),
        command: raw,
      }
    }

    return {
      type: 'OPEN_WEBSITE',
      target: siteKey,
      name: site.name,
      url: site.url,
      command: raw,
    }
  }


  // ------------------------------------------------
  // B4. Open website + query
  // ------------------------------------------------

  const openWithQueryRx = new RegExp(
    `^(?:(?:can you|could you|please|jarvis)\\s+)?(?:open|launch)` +
      `\\s+(${SITE_KEYS})\\s+(.+)$`,
    'i'
  )

  const openWithQueryMatch =
    lower.match(openWithQueryRx)

  if (openWithQueryMatch) {
    const siteKey =
      openWithQueryMatch[1].toLowerCase()

    const site =
      WEBSITE_ACTIONS[siteKey]

    const q =
      cleanQuery(openWithQueryMatch[2])

    if (q && site.searchUrl) {
      return {
        type: 'SEARCH_WEBSITE',
        target: siteKey,
        name: site.name,
        query: q,
        url:
          site.searchUrl +
          encodeURIComponent(q),
        command: raw,
      }
    }
  }


  // ================================================================
  // NO ACTION
  // ================================================================

  return null
}


// ================================================================
// EXECUTE BROWSER ACTION
// ================================================================
//
// Desktop actions are NOT executed here.
// They are sent to:
// DashboardPage
//      ↓
// Backend
//      ↓
// Desktop Agent
//
// ================================================================

export function executeAssistantAction(action) {
  if (!action) {
    return false
  }

  switch (action.type) {
    case 'OPEN_WEBSITE':
      window.open(
        action.url,
        '_blank',
        'noopener,noreferrer'
      )

      return true

    case 'SEARCH_WEBSITE':
      window.open(
        action.url,
        '_blank',
        'noopener,noreferrer'
      )

      return true

    default:
      return false
  }
}