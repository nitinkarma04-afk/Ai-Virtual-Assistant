const express = require('express')

const {
  executeActionController,
} = require('../controllers/action.controller')

const {
  authenticateAgent,
} = require('../middlewares/agent-auth.middleware')

const router = express.Router()

router.post(
  '/execute',
  authenticateAgent,
  executeActionController
)

module.exports = router