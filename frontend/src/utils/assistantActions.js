const WEBSITE_ACTIONS = {
  youtube: {
    name: "YouTube",
    url: "https://www.youtube.com",
  },

  github: {
    name: "GitHub",
    url: "https://github.com",
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
  },

  spotify: {
    name: "Spotify",
    url: "https://open.spotify.com",
  },
};

const OPEN_KEYWORDS = [
  "open",
  "launch",
  "start",
  "go to",
  "take me to",
  "visit",
];

export function detectAssistantAction(command) {
  if (!command || typeof command !== "string") {
    return null;
  }

  const text = command.toLowerCase().trim();

  const hasOpenCommand = OPEN_KEYWORDS.some((keyword) =>
    text.includes(keyword)
  );

  if (!hasOpenCommand) {
    return null;
  }

  for (const [key, website] of Object.entries(WEBSITE_ACTIONS)) {
    if (text.includes(key)) {
      return {
  type: "OPEN_WEBSITE",
  target: key,
  name: website.name,
  url: website.url,
  command: command,
}
    }
  }

  return null;
}

export function executeAssistantAction(action) {
  if (!action) {
    return false;
  }

  switch (action.type) {
    case "OPEN_WEBSITE":
      window.open(action.url, "_blank", "noopener,noreferrer");
      return true;

    default:
      return false;
  }
}