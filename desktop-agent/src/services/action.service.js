const { openApp } = require('../commands/app.commands')
const { openUrl } = require('../commands/browser.commands')
const { openFile } = require('../commands/file.commands')
const { takeScreenshot } = require('../commands/screenshot.commands')

async function executeAction(action, target) {
  switch (action) {
    case 'OPEN_APP':
      return openApp(target)

    case 'OPEN_URL':
      return openUrl(target)

    case 'OPEN_FILE':
      return openFile(target)

    case 'SCREENSHOT':
      return takeScreenshot()

    default:
      return {
        success: false,
        error: `Unsupported action: ${action}`,
      }
  }
}

module.exports = {
  executeAction,
}