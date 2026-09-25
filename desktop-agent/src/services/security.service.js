function isValidApiKey(providedKey) {
  const expectedKey = process.env.AGENT_API_KEY

  if (!expectedKey || !providedKey) {
    return false
  }

  return providedKey === expectedKey
}

module.exports = {
  isValidApiKey,
}