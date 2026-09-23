const { openApp } = require('../commands/app.commands')
const { openUrl } = require('../commands/browser.commands')

async function executeAction(action, target) {
  switch (action) {
    case 'OPEN_APP':
      return openApp(target)

    case 'OPEN_URL':
      return openUrl(target)

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