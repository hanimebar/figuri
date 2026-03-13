import Anthropic from '@anthropic-ai/sdk'

let anthropicInstance: Anthropic | null = null

export function getAnthropic(): Anthropic {
  if (!anthropicInstance) {
    anthropicInstance = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })
  }
  return anthropicInstance
}

export const CLAUDE_MODEL = 'claude-haiku-4-5-20251001'
