const screenshot = require('screenshot-desktop')
const fs = require('fs')
const path = require('path')

async function takeScreenshot() {
  try {
    const screenshotsDir = path.resolve(
      __dirname,
      '../../screenshots'
    )

    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, {
        recursive: true,
      })
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')

    const filePath = path.join(
      screenshotsDir,
      `screenshot-${timestamp}.png`
    )

    await screenshot({
      filename: filePath,
    })

    return {
      success: true,
      action: 'SCREENSHOT',
      target: filePath,
    }
  } catch (error) {
    console.error('[SCREENSHOT]', error)

    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  takeScreenshot,
}