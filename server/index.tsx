import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import textParser from './text_parser'


const app = new Hono()

app.use(logger())
app.use('*', cors())


app.post('/parse-text', async (c) => {
  let data = await c.req.json()
  let result = textParser(data.text, data.source)
  return c.json(result)
})



console.log("\nHono server started...\n")
Bun.serve({
  port: 3000,
  hostname: "127.0.0.1",
  development: false,
  fetch: app.fetch
})