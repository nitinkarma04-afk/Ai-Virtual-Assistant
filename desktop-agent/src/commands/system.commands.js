const { spawn } = require('child_process')

function shutdown() {
  try {
    const process = spawn(
      'shutdown.exe',
      ['/s', '/t', '0'],
      {
        detached: true,
        stdio: 'ignore',
        shell: false,
      }
    )

    process.unref()

    return {
      success: true,
      action: 'SHUTDOWN',
    }
  } catch (error) {
    console.error('[SHUTDOWN]', error)

    return {
      success: false,
      error: error.message,
    }
  }
}

function restart() {
  try {
    const process = spawn(
      'shutdown.exe',
      ['/r', '/t', '0'],
      {
        detached: true,
        stdio: 'ignore',
        shell: false,
      }
    )

    process.unref()

    return {
      success: true,
      action: 'RESTART',
    }
  } catch (error) {
    console.error('[RESTART]', error)

    return {
      success: false,
      error: error.message,
    }
  }
}


function lock() {
  try {
    const process = spawn(
      'rundll32.exe',
      ['user32.dll,LockWorkStation'],
      {
        detached: true,
        stdio: 'ignore',
        shell: false,
      }
    )

    process.unref()

    return {
      success: true,
      action: 'LOCK',
    }
  } catch (error) {
    console.error('[LOCK]', error)

    return {
      success: false,
      error: error.message,
    }
  }
}
module.exports = {
  shutdown,
  restart,
  lock,
}
