import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import pino from 'pino'

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        browser: ["KingKong IA", "Chrome", "1.0"]
    })

    if (!sock.authState.creds.registered) {
        const phoneNumber = "535XXXXXXXX" // <-- CAMBIA ESTO POR TU NUMERO
        console.log("Generando código...")
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(`\n\n===== TU CODIGO ES: ${code} =====\n`)
        }, 3000)
    }

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', (u) => {
        if (u.connection === 'open') console.log('✅ BOT CONECTADO!')
    })

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ""
        const from = msg.key.remoteJid

        if (text.toLowerCase().includes('/menu')) {
            await sock.sendMessage(from, { text: `🦍 *LA PATADA KING KONG IA* 🦍\n\n*MENU:*\n1️⃣ /juego - Jugar 3D\n2️⃣ /link - Link del juego\n3️⃣ /patada - Patada\n\nTu juego: https://gonzalespachecolaura23-glitch.github.io/la-patada-king-kong-IA/` })
        }
        if (text.toLowerCase().includes('/juego') || text.toLowerCase().includes('/link')) {
            await sock.sendMessage(from, { text: `🎮 JUEGA: https://gonzalespachecolaura23-glitch.github.io/la-patada-king-kong-IA/` })
        }
    })
}
startBot()
