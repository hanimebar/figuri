export type Language = 'en' | 'fr' | 'de' | 'fi' | 'es' | 'es-419' | 'nl' | 'it' | 'pt-BR' | 'sv' | 'nb'

export const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'fi', label: 'Suomi', flag: '🇫🇮' },
  { value: 'es', label: 'Español (España)', flag: '🇪🇸' },
  { value: 'es-419', label: 'Español (LATAM)', flag: '🌎' },
  { value: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷' },
  { value: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { value: 'nb', label: 'Norsk', flag: '🇳🇴' },
]

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  fr: 'French',
  de: 'German',
  fi: 'Finnish',
  es: 'Spanish (Spain)',
  'es-419': 'Spanish (LATAM)',
  nl: 'Dutch',
  it: 'Italian',
  'pt-BR': 'Brazilian Portuguese',
  sv: 'Swedish',
  nb: 'Norwegian',
}

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'

export type NarrativeStatus = 'draft' | 'sent'

export type MonthlyStatusColor = 'green' | 'amber' | 'red' | 'grey'

export interface Accountant {
  id: string
  email: string
  business_name: string
  logo_url: string | null
  reply_to_email: string | null
  default_booking_link_url: string | null
  stripe_customer_id: string | null
  stripe_subscription_status: SubscriptionStatus | null
  stripe_subscription_id: string | null
  trial_ends_at: string | null
  currency: string
  created_at: string
}

export interface Client {
  id: string
  accountant_id: string
  name: string
  email: string
  business_type: string
  context_notes: string | null
  language: Language
  booking_link_url: string | null
  created_at: string
  // computed
  latest_narrative_status?: NarrativeStatus | null
  latest_period?: string | null
}

export interface MonthlyFigures {
  id: string
  client_id: string
  accountant_id: string
  period_month: string
  revenue: number
  cost_of_goods: number | null
  gross_margin_pct: number | null
  operating_expenses: number
  net_profit: number
  cash_position: number
  one_off_items: string | null
  context_note: string | null
  created_at: string
}

export interface Narrative {
  id: string
  figures_id: string
  client_id: string
  accountant_id: string
  language: Language
  body_text: string
  status: NarrativeStatus
  generated_at: string
  sent_at: string | null
  booking_link_included: boolean
}

export interface NarrativeWithDetails extends Narrative {
  client: Client
  figures: MonthlyFigures
}

export interface GenerateNarrativeRequest {
  figures_id: string
  client_id: string
}

export interface SendNarrativeRequest {
  narrative_id: string
}

export interface DashboardStats {
  total_clients: number
  narratives_sent_this_month: number
  narratives_drafted_this_month: number
  clients_missing_update: number
}
