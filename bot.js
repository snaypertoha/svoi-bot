import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Telegraf, Markup } from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN)
const app = express()

app.use(cors())
app.use(express.json())

bot.start((ctx) => {
  ctx.reply(
    'Привіт! Це СВОЇ Харків — платформа локальних подій, знайомств і комʼюніті.',
    Markup.inlineKeyboard([
      Markup.button.webApp('Відкрити СВОЇ', process.env.WEBAPP_URL),
    ])
  )
})

app.post('/notify-booking', async (req, res) => {
  try {
    const { userName, userAge, eventTitle, eventDate, eventTime, location } =
      req.body

    const message = `
🔔 Нова заявка на подію

👤 Користувач: ${userName || 'Не вказано'}
🎂 Вік: ${userAge || 'Не вказано'}

🎟 Подія: ${eventTitle}
📅 Дата: ${eventDate || 'Не вказано'}
🕒 Час: ${eventTime || 'Не вказано'}
📍 Місце: ${location || 'Не вказано'}

Статус: очікує підтвердження
`

    await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, message)

    res.json({ success: true })
  } catch (error) {
    console.error('Notify booking error:', error)
    res.status(500).json({ success: false })
  }
})

app.get('/test-admin', async (req, res) => {
  try {
    await bot.telegram.sendMessage(
      process.env.ADMIN_CHAT_ID,
      '✅ Тестове повідомлення від Render'
    )

    res.send('OK')
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
})

bot.launch()

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Bot and API are running on port ${PORT}`)
})
app.post('/notify-booking', async (req, res) => {
  console.log('==== NEW BOOKING REQUEST ====')
  console.log(req.body)

  try {
    console.log('Sending message to admin...')

    await bot.telegram.sendMessage(
      process.env.ADMIN_CHAT_ID,
      'Тестове повідомлення'
    )

    console.log('Message sent successfully')

    res.json({ success: true })
  } catch (error) {
    console.error('SEND ERROR:', error)

    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})
