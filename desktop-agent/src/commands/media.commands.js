const robot = require('robotjs')

function mediaPlayPause() {
  try {
    robot.keyTap('audio_play')

    return {
      success: true,
      action: 'MEDIA_PLAY_PAUSE',
    }
  } catch (error) {
    console.error('[MEDIA_PLAY_PAUSE]', error)

    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  mediaPlayPause,
}