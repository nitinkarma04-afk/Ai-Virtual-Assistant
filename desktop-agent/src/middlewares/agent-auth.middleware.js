const { isValidApiKey } = require('../services/security.service')

function authenticateAgent(req, res, next) {
  const apiKey = req.headers['x-agent-key']

   

  if (!isValidApiKey(apiKey)) {
    
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
    })
  }
 

  next()
}

module.exports = {
  authenticateAgent,
}