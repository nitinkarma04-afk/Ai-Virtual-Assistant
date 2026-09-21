const { spawn } = require('child_process')

const ALLOWED_APPS = {
  notepad: 'notepad.exe',
  calculator: 'calc.exe',
  chrome: 'chrome.exe',
}

function openApp(appName) {
  const key = appName.toLowerCase().trim()
  const executable = ALLOWED_APPS[key]

  if (!executable) {
    return {
      success: false,
      error: `Application not allowed: ${appName}`,
    }
  }

  try {
    const process = spawn(executable, [], {
      detached: true,
      stdio: 'ignore',
      shell: false,
    })

    process.unref()

    return {
      success: true,
      action: 'OPEN_APP',
      target: key,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  openApp,
}