const robot = require('robotjs')

function volumeUp() {
  try {
    robot.keyTap('audio_vol_up')

    return {
      success: true,
      action: 'VOLUME_UP',
    }
  } catch (error) {
    console.error('[VOLUME_UP]', error)

    return {
      success: false,
      error: error.message,
    }
  }
}

function volumeDown() {
  try {
    robot.keyTap('audio_vol_down')

    return {
      success: true,
      action: 'VOLUME_DOWN',
    }
  } catch (error) {
    console.error('[VOLUME_DOWN]', error)

    return {
      success: false,
      error: error.message,
    }
  }
}

function mute() {
  try {
    robot.keyTap('audio_mute')

    return {
      success: true,
      action: 'MUTE',
    }
  } catch (error) {
    console.error('[MUTE]', error)

    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  volumeUp,
  volumeDown,
  mute,
}