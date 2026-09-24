const ALLOWED_ACTIONS = [
  'OPEN_APP',
  'OPEN_URL',
  'OPEN_FILE',
  'VOLUME_UP',
  'VOLUME_DOWN',
  'MUTE',
  'MEDIA_PLAY_PAUSE',
  'SCREENSHOT',
  'SHUTDOWN',
  'RESTART',
  'LOCK',
]

const ACTIONS_REQUIRING_TARGET = [
  'OPEN_APP',
  'OPEN_URL',
  'OPEN_FILE',
]

function validateActionPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {
      valid: false,
      error: 'Request body must be an object',
    }
  }

  const { action, target } = payload

  if (!action || typeof action !== 'string') {
    return {
      valid: false,
      error: 'action is required',
    }
  }

  if (!ALLOWED_ACTIONS.includes(action)) {
    return {
      valid: false,
      error: `Unsupported action: ${action}`,
    }
  }

  if (
    ACTIONS_REQUIRING_TARGET.includes(action) &&
    (!target || typeof target !== 'string')
  ) {
    return {
      valid: false,
      error: 'target is required',
    }
  }

  return {
    valid: true,
  }
}

module.exports = {
  validateActionPayload,
}