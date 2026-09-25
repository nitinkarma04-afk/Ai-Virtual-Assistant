module.exports = {
  host: process.env.AGENT_HOST || '127.0.0.1',
  port: Number(process.env.AGENT_PORT) || 47821,
}