import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover',
    })
  }
  return stripeInstance
}

export const STRIPE_PRICES = {
  SOLO_MONTHLY: process.env.STRIPE_SOLO_MONTHLY_PRICE_ID!,
  SOLO_ANNUAL: process.env.STRIPE_SOLO_ANNUAL_PRICE_ID!,
  GROWING_MONTHLY: process.env.STRIPE_GROWING_MONTHLY_PRICE_ID!,
  GROWING_ANNUAL: process.env.STRIPE_GROWING_ANNUAL_PRICE_ID!,
}

export const PLANS = {
  solo: {
    name: 'Solo Practice',
    monthlyGBP: 19,
    annualGBP: 149,
    monthlyEUR: 19,
    annualEUR: 179,
    clientLimit: 30,
    seats: 1,
    features: [
      'Up to 30 active clients',
      'All 5 launch languages',
      'Inline narrative editing',
      'Branded email dispatch',
      'Client history archive',
      'Monthly reminder cron',
    ],
  },
  growing: {
    name: 'Growing Practice',
    monthlyGBP: 39,
    annualGBP: 299,
    monthlyEUR: 39,
    annualEUR: 379,
    clientLimit: null,
    seats: 3,
    features: [
      'Unlimited active clients',
      'All languages (10+)',
      'Inline narrative editing',
      'Branded email dispatch',
      'Client history archive',
      'Monthly reminder cron',
      '3 team member seats',
      'Priority support',
    ],
  },
}
