'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

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
  'Get a price estimate',
  'See our work',
  'Do you ship to my country?',
]

const DEFAULT_CHIPS_BG = [
  'Минимална поръчка?',
  'Колко бързо е производството?',
  'Оценка на цената',
  'Вижте нашата работа',
  'Доставяте ли до нас?',
]

const FALLBACK_EN =
  "I'm not sure I understood that. Could you rephrase your question, or choose one of the options below?"
const FALLBACK_BG =
  'Не съм сигурен, че разбрах. Може ли да перефразирате въпроса или да изберете една от опциите по-долу?'

const PAGE_WELCOMES: Record<string, { en: string; bg: string }> = {
  contact: {
    en: "You're on our contact page. Would you like us to call you back? I can take your details right now.",
    bg: 'Намирате се на нашата страница за контакт. Искате ли да ви се обадим? Мога да взема вашите данни в момента.',
  },
  products: {
    en: "You're browsing our products. Looking for something specific? I can help you find the right packaging format or get you a quote.",
    bg: 'Разглеждате нашите продукти. Търсите нещо конкретно? Мога да ви помогна да намерите подходящия формат или да получите оферта.',
  },
  services: {
    en: "You're on our services page. Want to know more about a specific production process, or are you ready to get a quote?",
    bg: 'Намирате се на страницата ни с услуги. Искате да научите повече за конкретен производствен процес или сте готови да получите оферта?',
  },
  faq: {
    en: "You're in the FAQ section. Can't find your answer? Choose a topic below and I'll try to help.",
    bg: 'Намирате се в секцията с въпроси и отговори. Не можете да намерите отговора? Изберете тема по-долу и ще се опитам да помогна.',
  },
  portfolio: {
    en: "You're viewing our portfolio. Impressed by something? I can tell you more about specific packaging types or help you start your own project.",
    bg: 'Разглеждате нашето портфолио. Нещо ви е впечатлило? Мога да ви кажа повече за конкретни видове опаковки или да ви помогна да стартирате собствен проект.',
  },
  home: {
    en: 'Welcome to SKAT Print! We produce custom packaging for food, cosmetics, retail, and beverage brands. What can I help you with?',
    bg: 'Добре дошли в SKAT Print! Произвеждаме персонализирани опаковки за хранителни, козметични, търговски и алкохолни марки. Как мога да ви помогна?',
  },
  fallback: {
    en: "Hi! I'm here to help with questions about packaging, pricing, or working with us. What are you looking for?",
    bg: 'Здравейте! Тук съм за въпроси относно опаковки, цени или работата с нас. Какво търсите?',
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
    response_en: 'Would you like us to call you back? I can take your details right now.',
    response_bg: 'Искате ли да ви се обадим? Мога да взема вашите данни в момента.',
    followUps_en: [],
    followUps_bg: [],
  },
  {
    id: 'greeting',
    triggers: [
      'hello', 'good morning', 'good afternoon', 'good evening',
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
      'get a price', 'price list', 'оценка на цената',
      'цена', 'цени', 'колко струва', 'оферта', 'оценка',
      'ценова листа', 'на каква цена', 'колко ще ми струва',
    ],
    response_en:
      'Our pricing depends on the product type, quantity, materials, and finishing options. Let me ask you a few quick questions so I can give you a more useful estimate.',
    response_bg:
      'Цените зависят от вида продукт, количеството, материалите и довършителните опции. Позволете ми да задам няколко бързи въпроса, за да мога да ви дам по-полезна оценка.',
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
      'Our minimum order depends on the product type. For standard folding boxes, the minimum is usually around 500 to 1,000 pieces. For corrugated boxes and display units, minimums vary by specification. For a precise minimum for your project, just get in touch or tell me what you are looking for.',
    response_bg:
      'Минималната поръчка зависи от вида продукт. За стандартни сгъваеми кутии минимумът е обикновено около 500 до 1 000 броя. За гофрирани кутии и дисплеи минимумите варират според спецификацията. За точен минимум за вашия проект просто се свържете с нас или ми кажете какво търсите.',
    followUps_en: ['Get a price estimate', 'See our work', 'How fast is production?', 'Contact us'],
    followUps_bg: ['Оценка на цената', 'Вижте нашата работа', 'Колко бързо е производството?', 'Контакти'],
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
      'Yes, we ship across Bulgaria and export to EU countries and beyond. Shipping costs and lead times vary by destination. For specific countries or volumes, our team can give you an exact shipping estimate alongside your production quote.',
    response_bg:
      'Да, доставяме из цяла България и изнасяме за страни от ЕС и извън тях. Разходите и сроковете за доставка варират според дестинацията. За конкретни държави или обеми нашият екип може да ви даде точна оценка за доставката заедно с офертата за производство.',
    followUps_en: ['Get a price estimate', 'How fast is production?', 'Contact us', 'About us'],
    followUps_bg: ['Оценка на цената', 'Колко бързо е производството?', 'Контакти', 'За нас'],
  },
  {
    id: 'services',
    triggers: [
      'services', 'what do you do', 'what do you offer', 'what can you do',
      'our services', 'нашите услуги',
      'услуги', 'какво правите', 'какво предлагате', 'какво можете',
    ],
    response_en:
      'We offer a full range of packaging production services: offset printing, corrugated board manufacturing, laminating and finishing, die cutting, and covering and coating. Each service is tailored to your specific packaging needs.',
    response_bg:
      'Предлагаме пълен набор от услуги за производство на опаковки: офсетов печат, гофрирана хартия, ламиниране и довършителни работи, щанцоване и лакиране и покритие. Всяка услуга е съобразена с вашите специфични нужди.',
    followUps_en: ["What's the minimum order?", 'Get a price estimate', 'How fast is production?', 'See our work'],
    followUps_bg: ['Минимална поръчка?', 'Оценка на цената', 'Колко бързо е производството?', 'Вижте нашата работа'],
  },
  {
    id: 'products',
    triggers: [
      'products', 'packaging', 'boxes', 'food packaging', 'cosmetic',
      'pos display', 'our products', 'нашите продукти',
      'продукти', 'опаковки', 'кутии', 'правите ли', 'произвеждате ли', 'имате ли',
    ],
    response_en:
      'We produce custom packaging across five main categories: POS displays, food packaging, alcohol packaging, cosmetics packaging, and fully custom packaging solutions. Everything is made to your specifications.',
    response_bg:
      'Произвеждаме персонализирани опаковки в пет основни категории: POS дисплеи, хранителни опаковки, опаковки за алкохол, козметични опаковки и изцяло персонализирани решения. Всичко се изработва по вашите спецификации.',
    followUps_en: ['Get a price estimate', "What's the minimum order?", 'See our work', 'Do you ship to my country?'],
    followUps_bg: ['Оценка на цената', 'Минимална поръчка?', 'Вижте нашата работа', 'Доставяте ли до нас?'],
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
      'You can reach us by email at office@skat-print.com or through the contact form on our website. We work Monday to Friday, 9am to 6pm Sofia time.',
    response_bg:
      'Можете да се свържете с нас по имейл на office@skat-print.com или чрез формата за контакт на сайта. Работим от понеделник до петък, от 9 до 18 часа.',
    followUps_en: ['Request a callback', 'Get a price estimate', 'How fast is production?'],
    followUps_bg: ['Заявете обратно обаждане', 'Оценка на цената', 'Колко бързо е производството?'],
  },
  {
    id: 'how_it_works',
    triggers: [
      'how does it work', 'how it works', 'ordering', 'how to order', 'how do i order',
      'как работи', 'как поръчам', 'как се поръчва',
    ],
    response_en:
      'The process is straightforward. You send us your specifications and artwork. We prepare a quote and a technical review. Once approved, production begins. Typical lead time is 10 to 15 business days depending on complexity and quantity.',
    response_bg:
      'Процесът е прост. Изпращате ни своите спецификации и файлове. Ние подготвяме оферта и техническа проверка. След одобрение стартира производството. Типичният срок е 10 до 15 работни дни в зависимост от сложността и количеството.',
    followUps_en: ['Get a price estimate', "What's the minimum order?", 'How fast is production?', 'Contact us'],
    followUps_bg: ['Оценка на цената', 'Минимална поръчка?', 'Колко бързо е производството?', 'Контакти'],
  },
  {
    id: 'about',
    triggers: [
      'about us', 'who are you', 'company', 'history', 'founded', 'since 1995',
      'за нас', 'кои сте', 'фирмата', 'история', 'основана',
    ],
    response_en:
      'SKAT Print has been producing custom packaging in Bulgaria since 1995. We work with B2B clients across Europe, specializing in high-quality print and packaging for food, cosmetics, retail, and beverage brands.',
    response_bg:
      'SKAT Print произвежда персонализирани опаковки в България от 1995 година. Работим с B2B клиенти в цяла Европа, специализирайки се в висококачествен печат и опаковки за хранителни, козметични, търговски и алкохолни марки.',
    followUps_en: ['See our work', 'Our services', 'Get a price estimate', 'Contact us'],
    followUps_bg: ['Вижте нашата работа', 'Нашите услуги', 'Оценка на цената', 'Контакти'],
  },
  {
    id: 'portfolio',
    triggers: [
      'portfolio', 'examples', 'samples', 'gallery', 'your work', 'projects',
      'see our work', 'вижте нашата работа',
      'портфолио', 'примери', 'мостри', 'галерия', 'проекти',
    ],
    response_en:
      "You can browse our portfolio to see examples of our printed packaging work across different industries and formats. It's a good way to get a sense of what we can do for your brand.",
    response_bg:
      'Можете да разгледате нашето портфолио с примери от нашата работа в различни индустрии и формати. Добър начин да усетите какво можем да направим за вашата марка.',
    followUps_en: ['Get a price estimate', 'Our products', 'Our services', 'Contact us'],
    followUps_bg: ['Оценка на цената', 'Нашите продукти', 'Нашите услуги', 'Контакти'],
  },
  {
    id: 'delivery',
    triggers: [
      'delivery', 'lead time', 'production time', 'how fast', 'turnaround',
      'колко бързо е производството', 'доставка',
      'срок', 'колко дни', 'производствен срок',
    ],
    response_en:
      'Standard production lead time is 10 to 15 business days after artwork approval. Delivery time on top of that depends on your location. We ship across Bulgaria and to EU countries. For a specific estimate, reach out through our contact form.',
    response_bg:
      'Стандартният производствен срок е 10 до 15 работни дни след одобрение на файловете. Срокът за доставка зависи от вашето местоположение. Доставяме из цяла България и в страни от ЕС. За конкретна оценка се свържете с нас чрез формата за контакт.',
    followUps_en: ['Get a price estimate', 'Do you ship to my country?', 'Contact us'],
    followUps_bg: ['Оценка на цената', 'Доставяте ли до нас?', 'Контакти'],
  },
  {
    id: 'materials',
    triggers: [
      'materials', 'cardboard', 'quality', 'certified', 'laminate', 'substrate',
      'материали', 'хартия', 'картон', 'качество', 'сертификат', 'покритие', 'ламинат',
    ],
    response_en:
      'We use premium coated and uncoated papers, corrugated cardboard, and specialty substrates. Our production meets EU packaging standards. We are happy to advise on the best material choice for your product type and budget.',
    response_bg:
      'Използваме висококачествени покрити и непокрити хартии, гофриран картон и специални субстрати. Производството ни отговаря на европейските стандарти за опаковки. С удоволствие ще ви посъветваме за най-добрия избор на материал за вашия продукт и бюджет.',
    followUps_en: ['Get a price estimate', 'Our services', 'Contact us'],
    followUps_bg: ['Оценка на цената', 'Нашите услуги', 'Контакти'],
  },
  {
    id: 'faq',
    triggers: [
      'frequently asked', 'common questions',
      'чзв', 'често задавани',
    ],
    response_en:
      'Our FAQ page covers the most common questions about ordering, materials, minimum quantities, artwork requirements, and more. It is a good starting point if you are new to working with us.',
    response_bg:
      'Нашата страница с Въпроси и отговори обхваща най-честите въпроси относно поръчването, материалите, минималните количества, изискванията за файлове и повече. Добро начало ако работите с нас за първи път.',
    followUps_en: ['Get a price estimate', 'Contact us', 'Request a callback'],
    followUps_bg: ['Оценка на цената', 'Контакти', 'Заявете обратно обаждане'],
  },
  {
    id: 'location',
    triggers: [
      'location', 'address', 'where are you', 'stara zagora', 'trud', 'plovdiv', 'hisarya',
      'местоположение', 'адрес', 'където се намирате', 'хисаря', 'труд', 'пловдив',
    ],
    response_en:
      'We are based in Bulgaria with facilities in the village of Trud near Plovdiv, and in Hisarya. We serve clients across Bulgaria and export to European markets. Full address details are on our Contact page.',
    response_bg:
      'Намираме се в България с обекти в село Труд край Пловдив и в Хисаря. Обслужваме клиенти из цяла България и изнасяме за европейски пазари. Пълните ни адреси са на страницата Контакти.',
    followUps_en: ['Contact us', 'Request a callback', 'Get a price estimate'],
    followUps_bg: ['Контакти', 'Заявете обратно обаждане', 'Оценка на цената'],
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

function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: unknown }).gtag === 'function') {
    ;(window as unknown as { gtag: (cmd: string, name: string, params?: Record<string, string>) => void }).gtag(
      'event',
      name,
      params
    )
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
  const base = 'w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]'
  const anim = (delay: string) =>
    reduced ? {} : { animation: `chatbot-dot-pulse 1.2s ease-in-out ${delay} infinite` }
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
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
  const [sessionLoaded, setSessionLoaded] = useState(false)

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

  // ─── Core helpers ─────────────────────────────────────────────────────────

  function addMsg(role: 'bot' | 'user', text: string) {
    setMessages(prev => [...prev, { id: makeId(), role, text }])
  }

  function injectBot(text: string, chips?: string[], nextMode?: ConversationMode, delay = 400) {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      addMsg('bot', text)
      if (chips !== undefined) setFollowUpChips(chips)
      if (nextMode !== undefined) setMode(nextMode)
    }, delay)
  }

  function injectBotAfter(delay: number, text: string, chips?: string[], nextMode?: ConversationMode) {
    setTimeout(() => injectBot(text, chips, nextMode), delay)
  }

  // ─── Open chat ────────────────────────────────────────────────────────────

  function openChat() {
    setIsOpen(true)
    trackEvent('chatbot_opened', { page: pathname, lang })

    if (messages.length > 0) return // restore existing session

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

  function startLeadFlow() {
    const transition =
      lang === 'bg'
        ? 'За да ви дам приблизителна ценова оценка, имам няколко бързи въпроса.'
        : 'To give you a rough price estimate, I have a few quick questions.'
    const step1Q = lang === 'bg' ? 'Какъв вид опаковки търсите?' : 'What type of packaging are you looking for?'
    const step1Chips =
      lang === 'bg'
        ? ['Хранителни & Напитки', 'Козметика', 'Търговски & POS', 'Алкохол', 'Друго']
        : ['Food & Beverage', 'Cosmetics', 'Retail & POS', 'Alcohol', 'Other']

    injectBot(transition, [])
    injectBotAfter(600, step1Q, step1Chips, 'qualify_product')
  }

  // ─── Callback success ─────────────────────────────────────────────────────

  function startCallbackSuccess() {
    const msg =
      lang === 'bg'
        ? 'Нашият екип е готов да разговаря. Свържете се директно с нас:'
        : 'Our team is ready to talk. You can reach us directly:'
    injectBot(msg, [], 'callback_success')
  }

  // ─── Reset ────────────────────────────────────────────────────────────────

  function handleReset() {
    const chips = lang === 'bg' ? DEFAULT_CHIPS_BG : DEFAULT_CHIPS_EN
    setMessages([])
    setFollowUpChips(chips)
    setMode('browse')
    setLeadData({ productType: null, quantityRange: null })
    try {
      sessionStorage.removeItem('skat_chat_session')
    } catch {}
    const { key } = getPageContext(pathname)
    const welcomeText = (PAGE_WELCOMES[key] ?? PAGE_WELCOMES.fallback)[lang]
    injectBot(welcomeText, chips)
  }

  // ─── Handle chip click ────────────────────────────────────────────────────

  function handleChip(chip: string) {
    // Navigation chips in success mode
    if (mode === 'success') {
      const portfolio = lang === 'bg' ? 'Виж портфолиото' : 'View Portfolio'
      const products = lang === 'bg' ? 'Разгледай продуктите' : 'Browse Products'
      const faq = lang === 'bg' ? 'Прочети ЧЗВ' : 'Read FAQ'
      if (chip === portfolio) { router.push(`/${lang}/portfolio`); return }
      if (chip === products) { router.push(`/${lang}/products`); return }
      if (chip === faq) { router.push(`/${lang}/faq`); return }
    }

    if (mode === 'qualify_product') {
      const step2Q = lang === 'bg' ? 'Какво количество имате предвид?' : 'What quantity are you thinking?'
      const step2Chips =
        lang === 'bg'
          ? ['До 1 000', '1 000 – 10 000', 'Над 10 000']
          : ['Under 1,000', '1,000 – 10,000', 'Over 10,000']
      addMsg('user', chip)
      setLeadData(prev => ({ ...prev, productType: chip }))
      injectBot(step2Q, step2Chips, 'qualify_quantity')
      return
    }

    if (mode === 'qualify_quantity') {
      const productType = leadData.productType ?? ''
      const successMsg =
        lang === 'bg'
          ? `Отлично! Член от нашия екип с удоволствие ще обсъди вашите нужди за ${productType} опаковки. Свържете се с нас за персонализирана оферта.`
          : `Great! A member of our team will be happy to discuss your ${productType} packaging needs. Get in touch to request a tailored quote.`
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
      injectBot(successMsg, navChips, 'success')
      return
    }

    if (mode === 'callback_success') return

    // browse mode — intent matching
    addMsg('user', chip)
    const result = matchIntent(normalizeInput(chip), lang)

    if (result.intentId) {
      trackEvent('chatbot_intent', { intent_id: result.intentId, lang })
    } else {
      trackEvent('chatbot_fallback', { input: chip.slice(0, 80), lang })
    }

    if (result.isCallback) {
      injectBot(result.response, [])
      setTimeout(() => startCallbackSuccess(), 600)
      return
    }

    if (result.isPricing) {
      injectBot(result.response, [])
      startLeadFlow()
      return
    }

    injectBot(result.response, result.followUps)
  }

  // ─── Motion variants ──────────────────────────────────────────────────────

  const isTerminal = mode === 'success' || mode === 'callback_success'

  const tabMotion = reduced
    ? {}
    : { initial: { opacity: 0, x: 10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 10 } }

  const panelMotion = reduced
    ? {}
    : { initial: { x: 320 }, animate: { x: 0 }, exit: { x: 320 } }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Pull-tab — desktop only, shown when panel is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            {...tabMotion}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={openChat}
            aria-label={t.chatbot.aria_open}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-2 py-4 px-2.5 bg-[var(--color-accent)] text-white rounded-l-[var(--radius-md)] shadow-[var(--shadow-accent)] hover:bg-[var(--color-accent-hover)] transition-[background-color] select-none"
          >
            <IconMsg cls="w-5 h-5" />
            <span
              className="text-[10px] font-semibold tracking-wide leading-none"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {lang === 'bg' ? 'Чат' : 'Chat'}
            </span>
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel — desktop only, slides in from right */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...panelMotion}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'bg' ? 'Чат поддръжка' : 'Chat support'}
            className="fixed right-0 top-[72px] bottom-0 z-50 hidden md:flex flex-col w-[320px] bg-[var(--color-bg-light-surface)] border-l border-[var(--color-border)] shadow-[var(--shadow-lg)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 h-11 bg-[var(--color-accent)] flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                <span
                  className="font-semibold text-white text-sm tracking-wide"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {t.chatbot.panel_title}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1 -mr-1"
                aria-label={t.chatbot.aria_close}
              >
                <IconX cls="w-4 h-4" />
              </button>
            </div>

            {/* Success icon strip */}
            {isTerminal && (
              <div className="flex justify-center pt-4 pb-1 flex-shrink-0">
                {mode === 'success' ? (
                  <IconCheck cls="w-8 h-8 text-[var(--color-accent)]" />
                ) : (
                  <IconPhone cls="w-8 h-8 text-[var(--color-accent)]" />
                )}
              </div>
            )}

            {/* Message list */}
            <div
              className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--color-border)]"
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
                    className={`max-w-[85%] break-words text-sm px-3 py-2 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[var(--color-accent)] text-white rounded-[var(--radius-md)] rounded-tr-sm'
                        : 'bg-white border border-[var(--color-border)] text-[var(--color-text)] rounded-[var(--radius-md)] rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] rounded-tl-sm px-3 py-2">
                    <TypingIndicator reduced={reduced} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Contact info for callback_success */}
            {mode === 'callback_success' && (
              <div className="flex-shrink-0 border-t border-[var(--color-border)] px-4 py-3 flex flex-col gap-2">
                <a
                  href="tel:+35942600500"
                  className="flex items-center gap-2 text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <IconPhone cls="w-4 h-4 flex-shrink-0 text-[var(--color-accent)]" />
                  +359 42 600 500
                </a>
                <a
                  href="mailto:office@skat-print.com"
                  className="flex items-center gap-2 text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" />
                  </svg>
                  office@skat-print.com
                </a>
                <a
                  href={`/${lang}/contact`}
                  className="mt-1 w-full text-center text-xs font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-[var(--radius-md)] py-2 px-3 transition-[background-color]"
                >
                  {lang === 'bg' ? 'Към страницата за контакти →' : 'Go to Contact Page →'}
                </a>
              </div>
            )}

            {/* CTA button for lead success */}
            {mode === 'success' && (
              <div className="flex-shrink-0 border-t border-[var(--color-border)] px-3 pt-3 pb-1">
                <a
                  href={`/${lang}/contact`}
                  className="block w-full text-center text-xs font-semibold text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-[var(--radius-md)] py-2 px-3 transition-[background-color]"
                >
                  {lang === 'bg' ? 'Свържете се с нас →' : 'Contact Our Team →'}
                </a>
              </div>
            )}

            {/* Chips */}
            {followUpChips.length > 0 && !isTerminal && (
              <div className="flex-shrink-0 border-t border-[var(--color-border)] pt-2 pb-1">
                <div className="flex flex-row gap-2 overflow-x-auto px-3 [&::-webkit-scrollbar]:hidden">
                  {followUpChips.map(chip => (
                    <button
                      key={chip}
                      onClick={() => handleChip(chip)}
                      className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-[border-color,color] duration-150 whitespace-nowrap"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nav chips for success */}
            {mode === 'success' && followUpChips.length > 0 && (
              <div className="flex-shrink-0 pt-1 pb-2">
                <div className="flex flex-row gap-2 overflow-x-auto px-3 [&::-webkit-scrollbar]:hidden">
                  {followUpChips.map(chip => (
                    <button
                      key={chip}
                      onClick={() => handleChip(chip)}
                      className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-[border-color,color] duration-150 whitespace-nowrap"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reset link for terminal states */}
            {isTerminal && (
              <div className="flex-shrink-0 border-t border-[var(--color-border)] px-3 py-2 text-center">
                <button
                  onClick={handleReset}
                  className="text-xs text-[var(--color-text-muted)] underline underline-offset-2 hover:text-[var(--color-text)] transition-colors"
                >
                  {lang === 'bg' ? 'Започни нов разговор' : 'Start a new conversation'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
