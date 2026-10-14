// LA PATADA DE KING KONG - PoCholo MonKey GOD HACKER - OWNER OF ALL SYSTEMS
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')
const readline = require('readline')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(res => rl.question(q, res))

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')
    const sock = makeWASocket({
        printQRInTerminal: false,
        auth: state,
        logger: P({ level: 'silent' }),
        browser: ['LA PATADA DE KING KONG', 'Chrome', '1.0']
    })

    if (!sock.authState.creds.registered) {
        console.log('\n===================================')
        console.log(' LA PATADA DE KING KONG')
        console.log(' PoCholo MonKey - GOD HACKER')
        console.log('===================================\n')
        const num = await ask('Pon el numero que quieras vincular con lada (ej: 5358xxxxxx, 521234567890, 34xxxxxx): ')
        const cleanNum = num.replace(/[^0-9]/g,'')
        try {
            let code = await sock.requestPairingCode(cleanNum)
            code = code.match(/.{1,4}/g).join('-')
            console.log(`\n>>> TU CODIGO PARA ${cleanNum} ES: ${code} <<<`)
            console.log('Ve a ese WhatsApp > Ajustes > Dispositivos vinculados > Vincular con numero\n')
        } catch(e) {
            console.log('Error:', e.message)
        }
    }

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', ({ connection }) => {
        if(connection === 'open') console.log('✅ LA PATADA DE KING KONG CONECTADA')
        if(connection === 'close') start()
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if(!m.message) return
        const texto = (m.message.conversation || m.message.extendedTextMessage?.text || "").toLowerCase().trim()
        if(texto === ".menu" || texto === "menu" || texto === "(menu)") {
            await sock.sendMessage(m.key.remoteJid, {
                image: { url: './logo-perfil.jpg' },
                caption: `*LA PATADA DE KING KONG* 🦍\n*PoCholo MonKey - GOD HACKER*\n*OWNER OF ALL SYSTEMS*\n\n╭─❍ MENU GOD ❍\n├.ping\n├.owner\n├.kingkong\n╰─ Bot activo global`
            })
        }
    })
}
start()