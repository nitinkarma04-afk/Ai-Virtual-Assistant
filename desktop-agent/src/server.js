const express = require('express')

const {
  host,
  port,
} = require('./config/agent.config')

const actionRoutes = require('./routes/action.routes')

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'jarvis-desktop-agent',
    status: 'online',
  })
})

app.use('/', actionRoutes)

app.listen(port, host, () => {
  console.log('=================================')
  console.log('      JARVIS DESKTOP AGENT')
  console.log('=================================')
  console.log(`Agent API: http://${host}:${port}`)
  console.log('Status: ONLINE')
})