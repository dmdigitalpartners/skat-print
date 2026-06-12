'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { trackEvent as trackAnalyticsEvent } from '@/lib/analytics'

// Inline SVG icons
function IconMsg({ cls }: { cls: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function IconX({ cls }: { cls: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
function IconCheck({ cls }: { cls: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
function IconPhone({ cls }: { cls: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 15a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 4.22l3.09 1.57a2 2 0 0 1 .47 2.07l-1.3 3.69a2 2 0 0 0 .46.6l3.89 3.89a2 2 0 0 0 .6.46l3.69-1.3a2 2 0 0 1 2.07.47z" />
    </svg>
  )
}
function IconArrow({ cls }: { cls: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

import type { Translation, Lang } from '@/lib/useTranslation'

// ─── Types ───────────────────────────────────────────────────────────────────

type ConversationMode =
  | 'browse'
  | 'qualify_product'
  | 'qualify_quantity'
  | 'success'
  | 'callback_success'

interface Message {
  id: string
  role: 'bot' | 'user'
  text: string
}

interface LeadData {
  productType: string | null
  quantityRange: string | null
}

interface ChatSession {
  messages: Message[]
  followUpChips: string[]
  mode: ConversationMode
  leadData: LeadData
}

interface Intent {
  id: string
  triggers: string[]
  response_en: string
  response_bg: string
  followUps_en: string[]
  followUps_bg: string[]
  isCallbackIntent?: boolean
  isPricingIntent?: boolean
}

// ─── Copy constants ───────────────────────────────────────────────────────────

const DEFAULT_CHIPS_EN = [
  "What's the minimum order?",
  'How fast is production?',
  'Get a quick price estimate',
  'See our work',
  'Do you ship to my country?',
]

const DEFAULT_CHIPS_BG = [
  'Минимална поръчка?',
  'Колко бързо е производството?',
  'Бърза оценка на цената',
  'Вижте нашата работа',
  'Доставяте ли до нас?',
]

const FALLBACK_EN =
  "Hmm, I didn't quite catch that. Could you rephrase, or just pick one of the options below?"
const FALLBACK_BG =
  'Хм, не успях да разбера напълно. Може ли да перефразирате или просто изберете опция по-долу?'

const PAGE_WELCOMES: Record<string, { en: string; bg: string }> = {
  contact: {
    en: "You're on our contact page — good timing! Want us to call you back? Just say the word and I'll grab your details right now.",
    bg: 'Намирате се на нашата страница за контакт — точно навреме! Искате ли да ви се обадим? Само кажете и ще взема данните ви веднага.',
  },
  products: {
    en: "Nice to see you browsing our products! Looking for something specific? I can help you find the right format or get you a quick quote.",
    bg: 'Радвам се, че разглеждате нашите продукти! Търсите нещо конкретно? Мога да ви помогна да намерите подходящия формат или да получите бърза оферта.',
  },
  services: {
    en: "Happy to walk you through our services! Curious about a specific process, or are you ready to get a quote?",
    bg: 'С удоволствие ще ви запозная с услугите ни! Интересувате се от конкретен процес или сте готови да получите оферта?',
  },
  faq: {
    en: "Great place to start! If you can't find what you need in the FAQ, just ask me directly — I'm here.",
    bg: 'Добро начало! Ако не намерите отговора в ЧЗВ, просто ме попитайте директно — тук съм.',
  },
  portfolio: {
    en: "Love the portfolio page! See something that catches your eye? I can tell you more about it or help you kick off your own project.",
    bg: 'Страхотна страница! Нещо привлича вниманието ви? Мога да ви кажа повече или да ви помогна да стартирате собствен проект.',
  },
  home: {
    en: "Hi there! Welcome to SKAT Print. We make custom packaging for food, cosmetics, retail, and beverage brands across Europe. What can I help you with today?",
    bg: 'Здравейте! Добре дошли в SKAT Print. Произвеждаме персонализирани опаковки за хранителни, козметични, търговски и алкохолни марки в цяла Европа. Как мога да ви помогна днес?',
  },
  fallback: {
    en: "Hi! I'm your packaging assistant — here to help with questions about pricing, products, or working with us. What are you looking for?",
    bg: 'Здравейте! Аз съм вашият асистент за опаковки — тук съм за въпроси относно цени, продукти или работата с нас. Какво търсите?',
  },
}

// ─── Intents ──────────────────────────────────────────────────────────────────

const INTENTS: Intent[] = [
  {
    id: 'callback',
    isCallbackIntent: true,
    triggers: [
      'call me', 'callback', 'call back', 'speak to someone', 'talk to a person',
      'human', 'agent', 'representative', 'request a callback',
      'обадете ми се', 'обратно обаждане', 'искам да говоря с човек',
      'свържи ме с човек', 'жив човек', 'оператор', 'представител',
      'заявете обратно обаждане', 'заявете обаждане',
    ],
    response_en: "Of course! I'd love to get someone from our team on the phone with you. Here's how to reach us directly:",
    response_bg: 'Разбира се! Ще се радвам да свържа някой от екипа ни с вас. Ето как да се свържете директно:',
    followUps_en: [],
    followUps_bg: [],
  },
  {
    id: 'greeting',
    triggers: [
      'hello', 'good morning', 'good afternoon', 'good evening', 'hi', 'hey',
      'zdraveyte', 'zdrasti', 'здравейте', 'здрасти',
      'добър ден', 'добър вечер', 'добро утро', 'помощ',
    ],
    response_en:
      'Hello! Welcome to SKAT Print. We produce custom packaging for food, cosmetics, retail, and beverage brands. What can I help you with?',
    response_bg:
      'Здравейте! Добре дошли в SKAT Print. Произвеждаме персонализирани опаковки за хранителни, козметични, търговски и алкохолни марки. Как мога да ви помогна?',
    followUps_en: DEFAULT_CHIPS_EN,
    followUps_bg: DEFAULT_CHIPS_BG,
  },
  {
    id: 'pricing',
    isPricingIntent: true,
    triggers: [
      'price', 'pricing', 'cost', 'how much', 'quote', 'estimate',
      'get a price', 'price list', 'quick price', 'бърза оценка',
      'цена', 'цени', 'колко струва', 'оферта', 'оценка',
      'ценова листа', 'на каква цена', 'колко ще ми струва',
    ],
    response_en:
      "Great question! Pricing depends on the product type, quantity, materials, and finishing. Let me ask you a couple of quick questions so I can give you something useful.",
    response_bg:
      'Чудесен въпрос! Цените зависят от вида продукт, количеството, материалите и довършителните опции. Позволете ми да задам няколко бързи въпроса, за да мога да ви дам полезна оценка.',
    followUps_en: [],
    followUps_bg: [],
  },
  {
    id: 'minimum_order',
    triggers: [
      'minimum order', 'minimum quantity', 'smallest order', 'minimum pieces',
      'smallest quantity', 'minimum run', 'min order', "what's the minimum",
      'минимална поръчка', 'минимално количество', 'колко минимум',
      'поне колко', 'най-малко колко', 'минимален тираж',
    ],
    response_en:
      "Our minimum order depends on the product type. For standard folding boxes, it's usually around 500 to 1,000 pieces. For corrugated boxes and display units, minimums vary by spec. Tell me what you're looking for and I can give you a more precise answer.",
    response_bg:
      'Минималната поръчка зависи от вида продукт. За стандартни сгъваеми кутии минимумът е обикновено около 500 до 1 000 броя. За гофрирани кутии и дисплеи минимумите варират. Кажете ми какво търсите и ще ви дам по-точен отговор.',
    followUps_en: ['Get a quick price estimate', 'See our work', 'How fast is production?', 'Contact us'],
    followUps_bg: ['Бърза оценка на цената', 'Вижте нашата работа', 'Колко бързо е производството?', 'Контакти'],
  },
  {
    id: 'shipping_countries',
    triggers: [
      'ship to', 'shipping to', 'do you deliver to', 'do you ship',
      'deliver outside', 'outside bulgaria', 'do you ship to my country',
      'доставяте ли до', 'изнасяте ли', 'доставка до',
      'международна доставка', 'извън българия', 'доставка в чужбина',
      'доставяте ли до нас',
    ],
    response_en:
      'Yes! We ship across Bulgaria and export to EU countries and beyond. Costs and lead times vary by destination. Our team can include an exact shipping estimate with your production quote — just reach out.',
    response_bg:
      'Да! Доставяме из цяла България и изнасяме за страни от ЕС и извън тях. Разходите варират според дестинацията. Нашият екип може да включи точна оценка за доставката към офертата ви — просто се свържете с нас.',
    followUps_en: ['Get a quick price estimate', 'How fast is production?', 'Contact us', 'About us'],
    followUps_bg: ['Бърза оценка на цената', 'Колко бързо е производството?', 'Контакти', 'За нас'],
  },
  {
    id: 'services',
    triggers: [
      'services', 'what do you do', 'what do you offer', 'what can you do',
      'our services', 'нашите услуги',
      'услуги', 'какво правите', 'какво предлагате', 'какво можете',
    ],
    response_en:
      'We offer a full production suite: offset printing, corrugated board manufacturing, laminating and finishing, die cutting, and coating. Every service is tailored to your packaging needs — nothing off the shelf.',
    response_bg:
      'Предлагаме пълен набор от производствени услуги: офсетов печат, гофрирана хартия, ламиниране и довършителни работи, щанцоване и лакиране. Всяка услуга е съобразена с вашите нужди — нищо стандартно.',
    followUps_en: ["What's the minimum order?", 'Get a quick price estimate', 'How fast is production?', 'See our work'],
    followUps_bg: ['Минимална поръчка?', 'Бърза оценка на цената', 'Колко бързо е производството?', 'Вижте нашата работа'],
  },
  {
    id: 'products',
    triggers: [
      'products', 'packaging', 'boxes', 'food packaging', 'cosmetic',
      'pos display', 'our products', 'нашите продукти',
      'продукти', 'опаковки', 'кутии', 'правите ли', 'произвеждате ли', 'имате ли',
    ],
    response_en:
      'We produce custom packaging in five main categories: POS displays, food packaging, alcohol packaging, cosmetics packaging, and fully custom solutions. Everything is made to your exact specifications.',
    response_bg:
      'Произвеждаме персонализирани опаковки в пет основни категории: POS дисплеи, хранителни опаковки, опаковки за алкохол, козметични опаковки и изцяло персонализирани решения. Всичко по вашите спецификации.',
    followUps_en: ['Get a quick price estimate', "What's the minimum order?", 'See our work', 'Do you ship to my country?'],
    followUps_bg: ['Бърза оценка на цената', 'Минимална поръчка?', 'Вижте нашата работа', 'Доставяте ли до нас?'],
  },
  {
    id: 'contact',
    triggers: [
      'contact', 'reach you', 'get in touch', 'contact you',
      'contact us', 'контакти',
      'контакт', 'как да се свържа', 'свържете се с мен',
      'как да се свържа с вас', 'искам да говоря',
    ],
    response_en:
      "You can reach us by email at office@skat-print.com or through our contact form. We're available Monday to Friday, 9am – 6pm Sofia time. Happy to help!",
    response_bg:
      'Можете да се свържете с нас по имейл на office@skat-print.com или чрез формата за контакт. Работим от понеделник до петък, от 9 до 18 часа. С удоволствие ще помогнем!',
    followUps_en: ['Request a callback', 'Get a quick price estimate', 'How fast is production?'],
    followUps_bg: ['Заявете обратно обаждане', 'Бърза оценка на цената', 'Колко бързо е производството?'],
  },
  {
    id: 'how_it_works',
    triggers: [
      'how does it work', 'how it works', 'ordering', 'how to order', 'how do i order',
      'как работи', 'как поръчам', 'как се поръчва',
    ],
    response_en:
      "It's pretty straightforward. You share your specs and artwork → we prepare a quote and technical review → once approved, production begins. Typical lead time is 10 to 15 business days, depending on complexity.",
    response_bg:
      'Доста просто е. Изпращате ни спецификациите и файловете → подготвяме оферта и техническа проверка → след одобрение стартира производството. Типичният срок е 10 до 15 работни дни в зависимост от сложността.',
    followUps_en: ['Get a quick price estimate', "What's the minimum order?", 'How fast is production?', 'Contact us'],
    followUps_bg: ['Бърза оценка на цената', 'Минимална поръчка?', 'Колко бързо е производството?', 'Контакти'],
  },
  {
    id: 'about',
    triggers: [
      'about us', 'who are you', 'company', 'history', 'founded', 'since 1995',
      'за нас', 'кои сте', 'фирмата', 'история', 'основана',
    ],
    response_en:
      'SKAT Print has been producing custom packaging in Bulgaria since 1995 — over 30 years of experience. We work with B2B clients across Europe, specializing in premium print and packaging for food, cosmetics, retail, and beverage brands.',
    response_bg:
      'SKAT Print произвежда персонализирани опаковки в България от 1995 година — над 30 години опит. Работим с B2B клиенти в цяла Европа, специализирайки се в висококачествен печат и опаковки.',
    followUps_en: ['See our work', 'Our services', 'Get a quick price estimate', 'Contact us'],
    followUps_bg: ['Вижте нашата работа', 'Нашите услуги', 'Бърза оценка на цената', 'Контакти'],
  },
  {
    id: 'portfolio',
    triggers: [
      'portfolio', 'examples', 'samples', 'gallery', 'your work', 'projects',
      'see our work', 'вижте нашата работа',
      'портфолио', 'примери', 'мостри', 'галерия', 'проекти',
    ],
    response_en:
      "Our portfolio is a great way to get a feel for what we do — examples from food, cosmetics, retail, and more. Take a look and see if anything fits what you're imagining.",
    response_bg:
      'Нашето портфолио е чудесен начин да видите какво правим — примери от хранителната, козметичната, търговската сфера и не само. Разгледайте и вижте дали нещо отговаря на вашата идея.',
    followUps_en: ['Get a quick price estimate', 'Our products', 'Our services', 'Contact us'],
    followUps_bg: ['Бърза оценка на цената', 'Нашите продукти', 'Нашите услуги', 'Контакти'],
  },
  {
    id: 'delivery',
    triggers: [
      'delivery', 'lead time', 'production time', 'how fast', 'turnaround',
      'колко бързо е производството', 'доставка',
      'срок', 'колко дни', 'производствен срок',
    ],
    response_en:
      'Standard production lead time is 10 to 15 business days after artwork approval. Delivery on top of that depends on your location — we ship across Bulgaria and to EU countries. Need it faster? Reach out and we can talk options.',
    response_bg:
      'Стандартният производствен срок е 10 до 15 работни дни след одобрение на файловете. Доставката зависи от местоположението ви. Трябва ви по-бързо? Свържете се с нас и ще обсъдим варианти.',
    followUps_en: ['Get a quick price estimate', 'Do you ship to my country?', 'Contact us'],
    followUps_bg: ['Бърза оценка на цената', 'Доставяте ли до нас?', 'Контакти'],
  },
  {
    id: 'materials',
    triggers: [
      'materials', 'cardboard', 'quality', 'certified', 'laminate', 'substrate',
      'материали', 'хартия', 'картон', 'качество', 'сертификат', 'покритие', 'ламинат',
    ],
    response_en:
      'We use premium coated and uncoated papers, corrugated cardboard, and specialty substrates. All production meets EU packaging standards. Not sure what material suits your product? We can advise on the best fit for your type and budget.',
    response_bg:
      'Използваме висококачествени покрити и непокрити хартии, гофриран картон и специални субстрати. Производството отговаря на европейските стандарти. Не знаете кой материал подхожда? Ще ви посъветваме за най-доброто решение.',
    followUps_en: ['Get a quick price estimate', 'Our services', 'Contact us'],
    followUps_bg: ['Бърза оценка на цената', 'Нашите услуги', 'Контакти'],
  },
  {
    id: 'faq',
    triggers: [
      'frequently asked', 'common questions',
      'чзв', 'често задавани',
    ],
    response_en:
      'Our FAQ page covers ordering, materials, minimum quantities, artwork requirements, and more. A great starting point! If you still have questions after reading, just come back and ask me.',
    response_bg:
      'Нашата страница с ЧЗВ покрива поръчването, материалите, минималните количества, изискванията за файлове и повече. Добро начало! Ако след прочитането все още имате въпроси, просто ме попитайте.',
    followUps_en: ['Get a quick price estimate', 'Contact us', 'Request a callback'],
    followUps_bg: ['Бърза оценка на цената', 'Контакти', 'Заявете обратно обаждане'],
  },
  {
    id: 'location',
    triggers: [
      'location', 'address', 'where are you', 'stara zagora', 'trud', 'plovdiv', 'hisarya',
      'местоположение', 'адрес', 'където се намирате', 'хисаря', 'труд', 'пловдив',
    ],
    response_en:
      "We're based in Bulgaria — our facilities are in Trud (near Plovdiv) and Hisarya. We serve clients across Bulgaria and export to European markets. Full address details are on our Contact page.",
    response_bg:
      'Намираме се в България — нашите обекти са в село Труд (край Пловдив) и в Хисаря. Обслужваме клиенти из цяла България и изнасяме за европейски пазари. Пълните ни адреси са на страницата Контакти.',
    followUps_en: ['Contact us', 'Request a callback', 'Get a quick price estimate'],
    followUps_bg: ['Контакти', 'Заявете обратно обаждане', 'Бърза оценка на цената'],
  },
]

// ─── Utilities ────────────────────────────────────────────────────────────────

function normalizeInput(input: string): string {
  return (
    ' ' +
    input
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:'"]/g, '')
      .replace(/\s+/g, ' ') +
    ' '
  )
}

function matchIntent(
  normalized: string,
  lang: Lang
): { response: string; followUps: string[]; intentId: string | null; isCallback: boolean; isPricing: boolean } {
  for (const intent of INTENTS) {
    for (const trigger of intent.triggers) {
      const check = trigger.includes(' ')
        ? normalized.includes(trigger)
        : normalized.includes(' ' + trigger + ' ')
      if (check) {
        return {
          response: lang === 'bg' ? intent.response_bg : intent.response_en,
          followUps: lang === 'bg' ? intent.followUps_bg : intent.followUps_en,
          intentId: intent.id,
          isCallback: !!intent.isCallbackIntent,
          isPricing: !!intent.isPricingIntent,
        }
      }
    }
  }
  return {
    response: lang === 'bg' ? FALLBACK_BG : FALLBACK_EN,
    followUps: lang === 'bg' ? DEFAULT_CHIPS_BG : DEFAULT_CHIPS_EN,
    intentId: null,
    isCallback: false,
    isPricing: false,
  }
}

function calcTypingDelay(text: string): number {
  const len = text.length
  const base =
    len < 80 ? 800 + Math.random() * 700
    : len < 180 ? 1500 + Math.random() * 1000
    : 2500 + Math.random() * 1500
  return Math.round(base)
}

function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}

function getPageContext(pathname: string): { key: string; isContact: boolean } {
  const p = pathname.toLowerCase()
  if (p.endsWith('/contact')) return { key: 'contact', isContact: true }
  if (p.includes('/products')) return { key: 'products', isContact: false }
  if (p.includes('/services')) return { key: 'services', isContact: false }
  if (p.endsWith('/faq')) return { key: 'faq', isContact: false }
  if (p.endsWith('/portfolio')) return { key: 'portfolio', isContact: false }
  if (p === '/en' || p === '/bg') return { key: 'home', isContact: false }
  return { key: 'fallback', isContact: false }
}

function loadSession(): ChatSession | null {
  try {
    const raw = sessionStorage.getItem('skat_chat_session')
    return raw ? (JSON.parse(raw) as ChatSession) : null
  } catch {
    return null
  }
}

function saveSession(session: ChatSession) {
  try {
    sessionStorage.setItem('skat_chat_session', JSON.stringify(session))
  } catch {}
}

function saveToStorage(key: string, submission: Record<string, string>) {
  try {
    const raw = localStorage.getItem(key)
    const data: { schema_version: number; submissions: Record<string, string>[] } = raw
      ? JSON.parse(raw)
      : { schema_version: 1, submissions: [] }
    data.submissions.push(submission)
    localStorage.setItem(key, JSON.stringify(data))
  } catch {}
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 9)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingIndicator({ reduced }: { reduced: boolean }) {
  const base = 'w-2 h-2 rounded-full bg-[var(--color-text-muted)]'
  const anim = (delay: string) =>
    reduced ? {} : { animation: `chatbot-dot-pulse 1.2s ease-in-out ${delay} infinite` }
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      <span className={base} style={anim('0s')} />
      <span className={base} style={anim('0.4s')} />
      <span className={base} style={anim('0.8s')} />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ChatbotProps {
  t: Translation
  lang: Lang
}

export default function Chatbot({ t, lang }: ChatbotProps) {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const reduced = useReducedMotion() ?? false

  // ── Persistent state (synced to sessionStorage)
  const [messages, setMessages] = useState<Message[]>([])
  const [followUpChips, setFollowUpChips] = useState<string[]>(
    lang === 'bg' ? DEFAULT_CHIPS_BG : DEFAULT_CHIPS_EN
  )
  const [mode, setMode] = useState<ConversationMode>('browse')
  const [leadData, setLeadData] = useState<LeadData>({ productType: null, quantityRange: null })

  // ── Transient state
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isConversationLocked, setIsConversationLocked] = useState(false)
  const [sessionLoaded, setSessionLoaded] = useState(false)

  // ── Mobile detection
  const [isMobile, setIsMobile] = useState(false)

  // ── Lead submission state
  const [leadEmail, setLeadEmail] = useState('')
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadSubmitting, setLeadSubmitting] = useState(false)

  // ── Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── Session restore on mount
  useEffect(() => {
    const session = loadSession()
    if (session) {
      setMessages(session.messages)
      setFollowUpChips(session.followUpChips)
      setMode(session.mode)
      setLeadData(session.leadData)
    }
    setSessionLoaded(true)
  }, [])

  // ── Session save on state change
  useEffect(() => {
    if (!sessionLoaded) return
    saveSession({ messages, followUpChips, mode, leadData })
  }, [messages, followUpChips, mode, leadData, sessionLoaded])

  // ── Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // ── ESC to close
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen])

  // ── Mobile breakpoint detection (shared with Tailwind's md = 768px)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const check = () => setIsMobile(mql.matches)
    check()
    mql.addEventListener('change', check)
    return () => mql.removeEventListener('change', check)
  }, [])

  // ─── Core helpers ─────────────────────────────────────────────────────────

  function addMsg(role: 'bot' | 'user', text: string) {
    setMessages(prev => [...prev, { id: makeId(), role, text }])
  }

  function injectBot(text: string, chips?: string[], nextMode?: ConversationMode, delay?: number, onDone?: () => void) {
    const typingDelay = delay ?? calcTypingDelay(text)
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addMsg('bot', text)
      if (chips !== undefined) setFollowUpChips(chips)
      if (nextMode !== undefined) setMode(nextMode)
      onDone?.()
    }, typingDelay)
  }

  function injectBotAfter(delay: number, text: string, chips?: string[], nextMode?: ConversationMode, onDone?: () => void) {
    setIsTyping(true)
    setTimeout(() => injectBot(text, chips, nextMode, undefined, onDone), delay)
  }

  // ─── Open chat ────────────────────────────────────────────────────────────

  function openChat() {
    setIsOpen(true)
    trackEvent('chatbot_opened', { page: pathname, lang })
    trackAnalyticsEvent({ name: 'chatbot_opened' })

    if (messages.length > 0) return

    const { key, isContact } = getPageContext(pathname)
    const welcomeText = (PAGE_WELCOMES[key] ?? PAGE_WELCOMES.fallback)[lang]

    if (isContact) {
      const contactMsg =
        lang === 'bg'
          ? 'Нашият екип е готов да разговаря. Свържете се директно с нас:'
          : 'Our team is ready to talk. You can reach us directly:'
      injectBot(welcomeText, [], 'browse')
      injectBotAfter(1000, contactMsg, [], 'callback_success')
    } else {
      const chips = lang === 'bg' ? DEFAULT_CHIPS_BG : DEFAULT_CHIPS_EN
      injectBot(welcomeText, chips)
    }
  }

  // ─── Lead flow ────────────────────────────────────────────────────────────

  function startLeadFlow(onDone?: () => void) {
    const transition =
      lang === 'bg'
        ? 'За да ви дам приблизителна оценка, имам само няколко бързи въпроса.'
        : 'To give you a useful estimate, I just have a couple of quick questions.'
    const step1Q = lang === 'bg' ? 'Какъв вид опаковки търсите?' : "What type of packaging are you looking for?"
    const step1Chips =
      lang === 'bg'
        ? ['Хранителни & Напитки', 'Козметика', 'Търговски & POS', 'Алкохол', 'Друго']
        : ['Food & Beverage', 'Cosmetics', 'Retail & POS', 'Alcohol', 'Other']

    injectBot(transition, [], undefined, 600)
    injectBotAfter(600 + calcTypingDelay(step1Q) + 200, step1Q, step1Chips, 'qualify_product', onDone)
  }

  // ─── Callback success ─────────────────────────────────────────────────────

  function startCallbackSuccess(onDone?: () => void) {
    const msg =
      lang === 'bg'
        ? 'Нашият екип е готов да разговаря. Свържете се директно с нас:'
        : 'Our team is ready to talk. You can reach us directly:'
    injectBot(msg, [], 'callback_success', 600, onDone)
  }

  // ─── Reset ────────────────────────────────────────────────────────────────

  function handleReset() {
    const chips = lang === 'bg' ? DEFAULT_CHIPS_BG : DEFAULT_CHIPS_EN
    setMessages([])
    setFollowUpChips(chips)
    setMode('browse')
    setLeadData({ productType: null, quantityRange: null })
    setIsConversationLocked(false)
    setLeadEmail('')
    setLeadSubmitted(false)
    try {
      sessionStorage.removeItem('skat_chat_session')
    } catch {}
    const { key } = getPageContext(pathname)
    const welcomeText = (PAGE_WELCOMES[key] ?? PAGE_WELCOMES.fallback)[lang]
    injectBot(welcomeText, chips)
  }

  // ─── Handle chip click ────────────────────────────────────────────────────

  function handleChip(chip: string) {
    if (isConversationLocked) return

    if (mode === 'success') {
      const portfolio = lang === 'bg' ? 'Виж портфолиото' : 'View Portfolio'
      const products = lang === 'bg' ? 'Разгледай продуктите' : 'Browse Products'
      const faq = lang === 'bg' ? 'Прочети ЧЗВ' : 'Read FAQ'
      if (chip === portfolio) { router.push(`/${lang}/portfolio`); return }
      if (chip === products) { router.push(`/${lang}/products`); return }
      if (chip === faq) { router.push(`/${lang}/faq`); return }
    }

    if (mode === 'callback_success') return

    const unlock = () => setIsConversationLocked(false)
    setIsConversationLocked(true)

    if (mode === 'qualify_product') {
      const step2Q = lang === 'bg' ? 'Какво количество имате предвид?' : 'And roughly what quantity are you thinking?'
      const step2Chips =
        lang === 'bg'
          ? ['До 1 000', '1 000 – 10 000', 'Над 10 000']
          : ['Under 1,000', '1,000 – 10,000', 'Over 10,000']
      addMsg('user', chip)
      setLeadData(prev => ({ ...prev, productType: chip }))
      injectBot(step2Q, step2Chips, 'qualify_quantity', undefined, unlock)
      return
    }

    if (mode === 'qualify_quantity') {
      const productType = leadData.productType ?? ''
      const successMsg =
        lang === 'bg'
          ? `Отлично! Член от нашия екип ще се радва да обсъди нуждите ви за ${productType} опаковки. Свържете се с нас, когато сте готови.`
          : `Perfect! One of our team members will be happy to chat about your ${productType} packaging needs. Reach out whenever you're ready.`
      const navChips =
        lang === 'bg'
          ? ['Виж портфолиото', 'Разгледай продуктите', 'Прочети ЧЗВ']
          : ['View Portfolio', 'Browse Products', 'Read FAQ']
      addMsg('user', chip)
      setLeadData(prev => ({ ...prev, quantityRange: chip }))
      saveToStorage('skat_leads', {
        type: 'lead',
        product_type: leadData.productType ?? '',
        quantity_range: chip,
        lang,
        page: pathname,
        timestamp: new Date().toISOString(),
      })
      trackEvent('chatbot_lead', {
        product_type: leadData.productType ?? '',
        quantity_range: chip,
      })
      trackAnalyticsEvent({ name: 'chatbot_lead_qualified' })
      injectBot(successMsg, navChips, 'success', undefined, unlock)
      return
    }

    // browse mode — intent matching
    addMsg('user', chip)
    const result = matchIntent(normalizeInput(chip), lang)

    if (result.intentId) {
      trackEvent('chatbot_intent', { intent_id: result.intentId, lang })
    } else {
      trackEvent('chatbot_fallback', { input: chip.slice(0, 80), lang })
    }

    if (result.isCallback) {
      injectBot(result.response, [], undefined, undefined, () => startCallbackSuccess(unlock))
      return
    }

    if (result.isPricing) {
      injectBot(result.response, [], undefined, undefined, () => startLeadFlow(unlock))
      return
    }

    injectBot(result.response, result.followUps, undefined, undefined, unlock)
  }

  // ─── Lead submit ──────────────────────────────────────────────────────────

  async function handleLeadSubmit(e: FormEvent) {
    e.preventDefault()
    if (!leadEmail.trim() || leadSubmitting || leadSubmitted) return
    setLeadSubmitting(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chatbot-lead',
          contact: leadEmail.trim(),
          product_type: leadData.productType ?? '',
          quantity: leadData.quantityRange ?? '',
          lang,
          page: pathname,
        }),
      })
    } catch {}
    setLeadSubmitted(true)
    setLeadSubmitting(false)
  }

  // ─── Derived state ────────────────────────────────────────────────────────

  const isTerminal = mode === 'success' || mode === 'callback_success'
  // Show chips as large option cards only in the initial state
  const isInitialView = messages.length <= 1 && mode === 'browse'

  // ─── Motion variants ──────────────────────────────────────────────────────

  const fabMotion = reduced
    ? {}
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0, opacity: 0 },
        transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
      }

  const panelMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0.92, y: 16 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.92, y: 16 },
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      }

  // ─── Shared render helpers ────────────────────────────────────────────────

  function renderHeader(onClose: () => void) {
    return (
      <div
        className="flex-shrink-0 px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #1E3A5F 100%)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
            <IconMsg cls="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white text-[15px] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {t.chatbot.panel_title}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-green-400 text-xs">{t.chatbot.online}</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={handleReset}
              className="text-white/60 hover:text-white transition-colors p-1 text-base leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-1 rounded"
              aria-label={lang === 'bg' ? 'Нов разговор' : 'New conversation'}
            >
              ↻
            </button>
            <button
              onClick={onClose}
              className="text-white/50 hover:text-white transition-colors p-1 -mr-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-1 rounded"
              aria-label={t.chatbot.aria_close}
            >
              <IconX cls="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  function renderBody() {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Success icon strip */}
        {isTerminal && (
          <div className="flex justify-center pt-5 pb-1 flex-shrink-0">
            {mode === 'success' ? (
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent-subtle)] flex items-center justify-center">
                <IconCheck cls="w-6 h-6 text-[var(--color-accent)]" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent-subtle)] flex items-center justify-center">
                <IconPhone cls="w-6 h-6 text-[var(--color-accent)]" />
              </div>
            )}
          </div>
        )}

        {/* Message list */}
        <div
          className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--color-border)]"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={reduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] break-words text-sm px-3.5 py-2.5 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--color-accent)] text-white rounded-2xl rounded-tr-sm'
                    : 'bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-2xl rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-2xl rounded-tl-sm px-3.5 py-2.5">
                <TypingIndicator reduced={reduced} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Contact info + response time for callback_success */}
        {mode === 'callback_success' && (
          <div className="flex-shrink-0 border-t border-[var(--color-border)] px-4 py-3 flex flex-col gap-2 bg-white">
            <p className="text-xs text-[var(--color-text-muted)]">{t.chatbot.response_time_promise}</p>
            <a
              href="tel:+35942600500"
              className="flex items-center gap-2.5 text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors py-1"
            >
              <IconPhone cls="w-4 h-4 flex-shrink-0 text-[var(--color-accent)]" />
              +359 42 600 500
            </a>
            <a
              href="mailto:office@skat-print.com"
              className="flex items-center gap-2.5 text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors py-1"
            >
              <svg className="w-4 h-4 flex-shrink-0 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" />
              </svg>
              office@skat-print.com
            </a>
            <a
              href={`/${lang}/contact`}
              className="mt-1 w-full text-center text-xs font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-xl py-2.5 px-3 transition-[background-color]"
            >
              {lang === 'bg' ? 'Към страницата за контакти →' : 'Go to Contact Page →'}
            </a>
          </div>
        )}

        {/* Lead email form for success mode */}
        {mode === 'success' && (
          <div className="flex-shrink-0 border-t border-[var(--color-border)] px-3 pt-3 pb-2 bg-white">
            {leadSubmitted ? (
              <p className="text-xs font-medium text-[var(--color-accent)] text-center py-2">
                {t.chatbot.request_sent}
              </p>
            ) : (
              <form onSubmit={handleLeadSubmit} className="flex flex-col gap-2">
                <p className="text-xs text-[var(--color-text-muted)]">{t.chatbot.response_time_promise}</p>
                <input
                  type="email"
                  required
                  value={leadEmail}
                  onChange={e => setLeadEmail(e.target.value)}
                  placeholder={t.chatbot.email_placeholder}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-[border-color]"
                />
                <button
                  type="submit"
                  disabled={leadSubmitting || !leadEmail.trim()}
                  className="w-full text-xs font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-xl py-2.5 px-3 transition-[background-color] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {leadSubmitting ? '…' : t.chatbot.send_request}
                </button>
              </form>
            )}
          </div>
        )}

        {/* CTA options — initial large cards */}
        {isInitialView && followUpChips.length > 0 && !isTyping && (
          <div className="flex-shrink-0 border-t border-[var(--color-border)] px-3 py-3 flex flex-col gap-1.5 bg-white">
            {followUpChips.map(chip => (
              <button
                key={chip}
                onClick={() => handleChip(chip)}
                disabled={isConversationLocked}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white text-left text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] hover:text-[var(--color-accent)] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-40 disabled:pointer-events-none"
              >
                <span>{chip}</span>
                <IconArrow cls="w-4 h-4 flex-shrink-0 opacity-40" />
              </button>
            ))}
          </div>
        )}

        {/* Follow-up chips — after conversation */}
        {!isInitialView && followUpChips.length > 0 && !isTerminal && (
          <div className="flex-shrink-0 border-t border-[var(--color-border)] pt-2 pb-2 bg-white">
            <div className="flex flex-row flex-wrap gap-2 px-3">
              {followUpChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => handleChip(chip)}
                  disabled={isConversationLocked}
                  className="flex-shrink-0 px-3 py-2 text-sm font-medium rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-[border-color,color] duration-150 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-40 disabled:pointer-events-none"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nav chips for success */}
        {mode === 'success' && followUpChips.length > 0 && (
          <div className="flex-shrink-0 pt-1 pb-2 bg-white">
            <div className="flex flex-row flex-wrap gap-2 px-3">
              {followUpChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => handleChip(chip)}
                  disabled={isConversationLocked}
                  className="flex-shrink-0 px-3 py-2 text-sm font-medium rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-[border-color,color] duration-150 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-40 disabled:pointer-events-none"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Desktop FAB — shown when panel is closed */}
      <AnimatePresence>
        {!isOpen && !isMobile && (
          <motion.button
            {...fabMotion}
            onClick={openChat}
            aria-label={t.chatbot.aria_open}
            className="fixed bottom-6 right-6 z-50 hidden md:flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-accent)] text-white select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            style={{
              boxShadow: '0 4px 24px rgba(0,152,212,0.40), 0 2px 8px rgba(0,0,0,0.16)',
            }}
            whileHover={reduced ? {} : { scale: 1.08, boxShadow: '0 6px 32px rgba(0,152,212,0.55), 0 2px 10px rgba(0,0,0,0.20)' }}
            whileTap={reduced ? {} : { scale: 0.95 }}
          >
            {!reduced && (
              <span
                className="absolute inset-0 rounded-full bg-[var(--color-accent)]"
                style={{ animation: 'chatbot-fab-ring 2.2s ease-out infinite' }}
              />
            )}
            <IconMsg cls="w-6 h-6 relative z-10" />
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Desktop chat panel */}
      <AnimatePresence>
        {isOpen && !isMobile && (
          <motion.div
            {...panelMotion}
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'bg' ? 'Чат поддръжка' : 'Chat support'}
            className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col w-[360px] h-[580px] rounded-2xl overflow-hidden"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.10)',
              transformOrigin: 'bottom right',
            }}
          >
            {renderHeader(() => setIsOpen(false))}
            {renderBody()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile FAB — shown when drawer is closed */}
      <AnimatePresence>
        {!isOpen && isMobile && (
          <motion.button
            {...fabMotion}
            onClick={openChat}
            aria-label={t.chatbot.aria_open}
            className="fixed bottom-6 right-6 z-50 flex md:hidden items-center justify-center w-14 h-14 rounded-full bg-[var(--color-accent)] text-white select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            style={{
              boxShadow: '0 4px 24px rgba(0,152,212,0.40), 0 2px 8px rgba(0,0,0,0.16)',
            }}
            whileHover={reduced ? {} : { scale: 1.08 }}
            whileTap={reduced ? {} : { scale: 0.95 }}
          >
            {!reduced && (
              <span
                className="absolute inset-0 rounded-full bg-[var(--color-accent)]"
                style={{ animation: 'chatbot-fab-ring 2.2s ease-out infinite' }}
              />
            )}
            <IconMsg cls="w-6 h-6 relative z-10" />
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Mobile drawer — slides up from bottom */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? {} : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/40"
              aria-hidden="true"
            />
            {/* Drawer panel */}
            <motion.div
              initial={reduced ? false : { y: '100%' }}
              animate={{ y: 0 }}
              exit={reduced ? {} : { y: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-label={lang === 'bg' ? 'Чат поддръжка' : 'Chat support'}
              className="fixed inset-x-0 bottom-0 z-[51] flex flex-col h-[90vh] rounded-t-2xl overflow-hidden"
              style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.20)' }}
            >
              {renderHeader(() => setIsOpen(false))}
              {renderBody()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
