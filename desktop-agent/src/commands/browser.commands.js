const { spawn } = require('child_process')

function openUrl(url) {
  if (!url || typeof url !== 'string') {
    return {
      success: false,
      error: 'URL is required',
    }
  }

  let parsedUrl

  try {
    parsedUrl = new URL(url)
  } catch {
    return {
      success: false,
      error: 'Invalid URL',
    }
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return {
      success: false,
      error: 'Only HTTP and HTTPS URLs are allowed',
    }
  }

  try {
    spawn(
      'cmd.exe',
      ['/c', 'start', '', parsedUrl.toString()],
      {
        detached: true,
        stdio: 'ignore',
        shell: false,
      }
    ).unref()

    return {
      success: true,
      action: 'OPEN_URL',
      target: parsedUrl.toString(),
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  openUrl,
}