const readline = require('readline')
const { openApp } = require('./commands/app.commands')

console.log('=================================')
console.log('      JARVIS DESKTOP AGENT')
console.log('=================================')
console.log('Agent ready.')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Jarvis Agent > ',
})

function handleCommand(input) {
  const command = input.trim()

  if (!command) return

  const match = command.match(/^open\s+(.+)$/i)

  if (!match) {
    console.log('Unsupported command.')
    return
  }

  const result = openApp(match[1])

  if (result.success) {
    console.log(`✓ Opened: ${result.target}`)
  } else {
    console.log(`✗ ${result.error}`)
  }
}

rl.prompt()

rl.on('line', (input) => {
  handleCommand(input)
  rl.prompt()
})