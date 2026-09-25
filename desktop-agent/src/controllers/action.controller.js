const {
  validateActionPayload,
} = require('../validators/action.validator')

const {
  executeAction,
} = require('../services/action.service')

async function executeActionController(req, res) {
  const validation = validateActionPayload(req.body)

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error,
    })
  }

  const { action, target } = req.body

  try {
    const result = await executeAction(action, target)

    return res
      .status(result.success ? 200 : 400)
      .json(result)
  } catch (error) {
    console.error('[ACTION_CONTROLLER]', error)

    return res.status(500).json({
      success: false,
      error: 'Desktop action failed',
    })
  }
}

module.exports = {
  executeActionController,
}