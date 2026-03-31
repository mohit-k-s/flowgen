import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin, Connect } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from '@aws-sdk/client-bedrock-runtime'
import { getSystemPrompt } from './src/lib/prompt'

function bedrockProxyPlugin(): Plugin {
  return {
    name: 'bedrock-proxy',
    configureServer(server) {
      server.middlewares.use(
        '/api/generate',
        async (req: IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
          if (req.method !== 'POST') return next()

          // Read request body
          const body = await new Promise<string>((resolve, reject) => {
            let data = ''
            req.on('data', (chunk: Buffer) => (data += chunk.toString()))
            req.on('end', () => resolve(data))
            req.on('error', reject)
          })

          const { history = [], warningsEnabled = true } = JSON.parse(body) as {
            history: { role: 'user' | 'assistant'; content: string }[]
            warningsEnabled?: boolean
          }
          const region = process.env.VITE_AWS_REGION || 'us-east-1'
          const modelId = process.env.VITE_BEDROCK_MODEL_ID || 'amazon.nova-pro-v1:0'

          const client = new BedrockRuntimeClient({ region })

          // Build Bedrock messages array from history (already includes latest user message)
          const bedrockMessages = history.map((m) => ({
            role: m.role,
            content: [{ text: m.content }],
          }))

          const systemPrompt = getSystemPrompt(warningsEnabled)

          const command = new InvokeModelWithResponseStreamCommand({
            modelId,
            contentType: 'application/json',
            accept: 'application/json',
            body: Buffer.from(
              JSON.stringify({
                system: [{ text: systemPrompt }],
                messages: bedrockMessages,
                inferenceConfig: { max_new_tokens: 4096 },
              }),
            ),
          })

          res.setHeader('Content-Type', 'text/event-stream')
          res.setHeader('Cache-Control', 'no-cache')
          res.setHeader('Connection', 'keep-alive')

          try {
            const response = await client.send(command)
            if (response.body) {
              for await (const event of response.body) {
                if (event.chunk?.bytes) {
                  const decoded = new TextDecoder().decode(event.chunk.bytes)
                  const parsed = JSON.parse(decoded)
                  const text = parsed.contentBlockDelta?.delta?.text
                  if (text) {
                    res.write(`data: ${JSON.stringify({ text })}\n\n`)
                  }
                }
              }
            }
            res.write('data: [DONE]\n\n')
          } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            res.write(`data: ${JSON.stringify({ error: message })}\n\n`)
          } finally {
            res.end()
          }
        },
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), bedrockProxyPlugin()],
})
