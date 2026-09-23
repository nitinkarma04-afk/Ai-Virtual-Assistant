const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

function openFile(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return {
      success: false,
      error: 'File path is required',
    }
  }

  const resolvedPath = path.resolve(filePath)

  if (!fs.existsSync(resolvedPath)) {
    return {
      success: false,
      error: 'File does not exist',
    }
  }

  try {
    spawn('explorer.exe', [resolvedPath], {
      detached: true,
      stdio: 'ignore',
      shell: false,
    }).unref()

    return {
      success: true,
      action: 'OPEN_FILE',
      target: resolvedPath,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

module.exports = {
  openFile,
}