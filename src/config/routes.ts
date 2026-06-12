export const LANGS = ['en', 'bg'] as const
export type Lang = (typeof LANGS)[number]

export const VALID_CATEGORIES = [
  'pos-displays',
  'food-packaging',
  'alcohol-packaging',
  'cosmetics-packaging',
  'custom-packaging',
] as const
export type CategorySlug = (typeof VALID_CATEGORIES)[number]

export const VALID_SERVICES = [
  'offset-printing',
  'corrugated-board',
  'laminating-finishing',
  'die-cutting',
  'covering-coating',
] as const
export type ServiceSlug = (typeof VALID_SERVICES)[number]

export const VALID_INDUSTRIES = [
  'food-packaging',
  'cosmetics-packaging',
  'wine-spirits-packaging',
  'retail-pos-displays',
] as const
export type IndustrySlug = (typeof VALID_INDUSTRIES)[number]
