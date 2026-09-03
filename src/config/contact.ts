export const CONTACT = {
  phone_primary: '+359888351553',
  phone_primary_display: '+359 888 35 15 53',
  phone_secondary: '+359887461028',
  phone_secondary_display: '+359 887 46 10 28',
  email: 'office@skatoil.com',
  whatsapp: '+359888351553',
  address_primary: 'Stopanski dvor No. 2, Village of Trud, Plovdiv',
  address_secondary: '8 Yordan Yovkov St, Hisarya',
} as const

// Ordered to match footer.locations / contact_page.locations in the
// translation files: [0] Trud, [1] Hisarya. Localized address strings stay
// in the translation files (they genuinely differ per locale); phone
// numbers don't, so they're sourced from here instead of being duplicated
// into every locale's JSON.
export const LOCATION_PHONES = [
  { tel: CONTACT.phone_primary, display: CONTACT.phone_primary_display },
  { tel: CONTACT.phone_secondary, display: CONTACT.phone_secondary_display },
] as const
