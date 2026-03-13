import type { Language } from '@/types'
import type { Client, MonthlyFigures, Accountant } from '@/types'
import { formatPeriod } from './utils'

const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  fr: 'French',
  de: 'German',
  fi: 'Finnish',
  es: 'Spanish (Spain)',
  'es-419': 'Spanish (Latin America)',
  nl: 'Dutch',
  it: 'Italian',
  'pt-BR': 'Brazilian Portuguese',
  sv: 'Swedish',
  nb: 'Norwegian',
}

export function buildSystemPrompt(language: Language): string {
  const langName = LANGUAGE_NAMES[language]
  return `You are a plain-English financial narrative writer for accountants.
Your job is to write a short monthly update that an accountant sends
to their small business client. The update summarises the client's
financial performance for the month in clear, friendly, non-jargon
language that a business owner — not an accountant — can understand
and act on.

Rules you must follow without exception:
1. Write in ${langName}. Use vocabulary and number formatting natural
   to a native ${langName} speaker in a professional but warm context.
2. Write exactly 200–260 words. No more, no less.
3. Describe what the numbers show. Do not speculate about why the
   numbers are what they are unless the accountant has explicitly
   stated the reason in the context notes.
4. Do not use accounting jargon. Never use: EBITDA, amortisation,
   accruals, prepayments, deferred income, or similar technical terms.
5. Do not make predictions about future performance unless the
   accountant has provided forward-looking context.
6. Do not offer tax advice, legal advice, or any opinion that
   implies professional liability.
7. End every narrative with one open question specific to the numbers
   provided — not a generic question.
8. Format numbers according to ${langName} locale conventions.
   German/French/Finnish/Spanish: period as thousand separator,
   comma as decimal (e.g. 1.234,56).
   English: comma as thousand, period as decimal (e.g. 1,234.56).
   Dutch/Italian/Portuguese: period as thousand, comma as decimal.
   Swedish/Norwegian: space as thousand separator, comma as decimal.
9. Do not repeat the phrase "this month" more than twice.
10. Tone: warm and professional — like a trusted adviser, not a machine.`
}

export function buildUserMessage(
  client: Client,
  figures: MonthlyFigures,
  accountant: Accountant
): string {
  const currency = accountant.currency || 'GBP'
  const period = formatPeriod(figures.period_month)

  const cogsLine = figures.cost_of_goods != null
    ? `- Cost of goods sold: ${figures.cost_of_goods}`
    : `- Cost of goods sold: Not applicable — service business`

  const marginLine = figures.gross_margin_pct != null
    ? `- Gross margin: ${figures.gross_margin_pct}%`
    : `- Gross margin: Not applicable`

  return `Write a monthly financial update for the following client.

Client name: ${client.name}
Business type: ${client.business_type}
Standing context: ${client.context_notes || 'None provided'}
Month being reported: ${period}

Financial figures:
- Revenue: ${figures.revenue}
${cogsLine}
${marginLine}
- Operating expenses: ${figures.operating_expenses}
- Net profit: ${figures.net_profit}
- Cash in bank at month end: ${figures.cash_position}
- One-off items: ${figures.one_off_items || 'None'}
- Accountant's additional context: ${figures.context_note || 'None'}

Currency: ${currency}

Write the narrative now, following all rules in your instructions.`
}
