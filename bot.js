// BOT IA WHATSAPP - SOLO /menu
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import pino from 'pino'
const NUMERO = "535XXXXXXXX" // CAMBIA POR TU NUMERO REAL

async function iniciar() {
  const { state, saveCreds } = await useMultiFileAuthState('sesion')
  const sock = makeWASocket({ logger: pino({ level: 'silent' }), auth: state, printQRInTerminal: false, browser: ["BOT IA","Chrome","1.0"] })

  if (!state.creds.registered) {
    setTimeout(async () => {
      const code = await sock.requestPairingCode(NUMERO)
      console.log(`\nTU CODIGO DE 8 DIGITOS ES: ${code}\n`)
    }, 3000)
  }

  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', u => { if (u.connection === 'open') console.log('BOT CONECTADO') })

  sock.ev.on('messages.upsert', async m => {
    const msg = m.messages[0]
    if (!msg.message || msg.key.fromMe) return
    const texto = (msg.message.conversation || "").toLowerCase()
    const de = msg.key.remoteJid

    if (texto === '/menu') {
      await sock.sendMessage(de, { text: `*BOT IA MENU*\n\n1. /ayuda\n2. /info\n3. Escribe lo que quieras y te respondo como IA` })
    } else if (texto === '/ayuda') {
      await sock.sendMessage(de, { text: `Soy tu Bot IA, escribe /menu para ver opciones` })
    } else {
      // AQUI RESPONDE COMO IA A TODO
      await sock.sendMessage(de, { text: `🤖 IA: Recibi tu mensaje "${texto}". Soy tu bot IA funcionando en WhatsApp.` })
    }
  })
}
iniciar()
