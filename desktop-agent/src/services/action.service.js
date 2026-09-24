const { openApp } = require('../commands/app.commands')
const { openUrl } = require('../commands/browser.commands')
const { openFile } = require('../commands/file.commands')
const { takeScreenshot } = require('../commands/screenshot.commands')
const { volumeUp, volumeDown, mute } = require('../commands/volume.commands') 
const { mediaPlayPause } = require('../commands/media.commands')
const {
  shutdown,
  restart,
  lock,
} = require('../commands/system.commands')

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

    case 'VOLUME_UP':
      return volumeUp()

    case 'VOLUME_DOWN':
      return volumeDown()

    case 'MUTE':
      return mute()

    case 'MEDIA_PLAY_PAUSE':
      return mediaPlayPause()

    case 'SHUTDOWN':
      return shutdown()

    case 'RESTART':
      return restart()
    case 'LOCK':
      return lock()

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