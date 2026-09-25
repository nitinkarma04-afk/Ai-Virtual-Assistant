const DESKTOP_AGENT_URL =
  process.env.DESKTOP_AGENT_URL || 'http://127.0.0.1:47821'

export const executeDesktopAction = async (action, target) => {
  const desktopAgentKey = process.env.DESKTOP_AGENT_KEY

  const response = await fetch(
    `${DESKTOP_AGENT_URL}/execute`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Agent-Key': desktopAgentKey,
      },
      body: JSON.stringify({
        action,
        target,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data?.error ||
      'Desktop agent request failed'
    )
  }

  return data
}