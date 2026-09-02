import type { Lang } from '@/lib/useTranslation'

export interface Intent {
  id: string
  triggers: string[]
  response_en: string
  response_bg: string
  followUps_en: string[]
  followUps_bg: string[]
  isCallbackIntent?: boolean
  isPricingIntent?: boolean
}

export const DEFAULT_CHIPS_EN = [
  "What's the minimum order?",
  'How fast is production?',
  'Get a quick price estimate',
  'See our work',
  'Do you ship to my country?',
]

export const DEFAULT_CHIPS_BG = [
  'Минимална поръчка?',
  'Колко бързо е производството?',
  'Бърза оценка на цената',
  'Вижте нашата работа',
  'Доставяте ли до нас?',
]

export const FALLBACK_EN =
  "Hmm, I didn't quite catch that. Could you rephrase, or just pick one of the options below?"
export const FALLBACK_BG =
  'Хм, не успях да разбера напълно. Може ли да перефразирате или просто изберете опция по-долу?'

export const PAGE_WELCOMES: Record<string, { en: string; bg: string }> = {
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
    en: "Hi there! Welcome to Skat Print. We make custom packaging for food, cosmetics, retail, and beverage brands across Europe. What can I help you with today?",
    bg: 'Здравейте! Добре дошли в Скат Принт. Произвеждаме персонализирани опаковки за хранителни, козметични, търговски и алкохолни марки в цяла Европа. Как мога да ви помогна днес?',
  },
  fallback: {
    en: "Hi! I'm your packaging assistant — here to help with questions about pricing, products, or working with us. What are you looking for?",
    bg: 'Здравейте! Аз съм вашият асистент за опаковки — тук съм за въпроси относно цени, продукти или работата с нас. Какво търсите?',
  },
}

export const INTENTS: Intent[] = [
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
      'Hello! Welcome to Skat Print. We produce custom packaging for food, cosmetics, retail, and beverage brands. What can I help you with?',
    response_bg:
      'Здравейте! Добре дошли в Скат Принт. Произвеждаме персонализирани опаковки за хранителни, козметични, търговски и алкохолни марки. Как мога да ви помогна?',
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
      "Our minimum order depends on the product type. For standard boxes and packaging, we typically work from 500 units upward. For custom or specialty packaging and display units, minimums vary by spec. Tell me what you're looking for and I can give you a more precise answer.",
    response_bg:
      'Минималната поръчка зависи от вида продукт. За стандартни кутии и опаковки обикновено работим от 500 броя нагоре. За нестандартни или специализирани опаковки и дисплеи минимумите варират. Кажете ми какво търсите и ще ви дам по-точен отговор.',
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
      'Yes! We supply clients across Bulgaria and Europe. Costs and lead times vary by destination. Our team can include an exact shipping estimate with your production quote — just reach out.',
    response_bg:
      'Да! Доставяме продукти на клиенти из цяла България и Европа. Разходите варират според дестинацията. Нашият екип може да включи точна оценка за доставката към офертата ви — просто се свържете с нас.',
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
      'Предлагаме пълен набор от производствени услуги: офсетов печат, производство на велпапе, ламиниране и довършителни работи, щанцоване и каширане. Всяка услуга е съобразена с вашите нужди — нищо стандартно.',
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
      "You can reach us by email at office@skatoil.com or through our contact form — we respond within 24 hours. Happy to help!",
    response_bg:
      'Можете да се свържете с нас по имейл на office@skatoil.com или чрез формата за контакт — отговаряме в рамките на 24 часа. С удоволствие ще помогнем!',
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
      'Skat Print has been producing custom packaging in Bulgaria since 1995 — over 30 years of experience. We work with B2B clients across Europe, specializing in premium print and packaging for food, cosmetics, retail, and beverage brands.',
    response_bg:
      'Скат Принт произвежда персонализирани опаковки в България от 1995 година — над 30 години опит. Работим с B2B клиенти в цяла Европа, специализирайки се в висококачествен печат и опаковки.',
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
      'We use premium coated and uncoated papers, corrugated board (velpape), and specialty substrates — all 100% recyclable and produced under strict in-house quality control. Not sure what material suits your product? We can advise on the best fit for your type and budget.',
    response_bg:
      'Използваме висококачествени покрити и непокрити хартии, велпапе и специални субстрати — всички 100% рециклируеми и произведени под строг вътрешен контрол на качеството. Не знаете кой материал подхожда? Ще ви посъветваме за най-доброто решение.',
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
      'location', 'address', 'where are you', 'trud', 'plovdiv', 'hisarya',
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

export function matchIntent(
  input: string,
  lang: Lang
): { response: string; followUps: string[]; intentId: string | null; isCallback: boolean; isPricing: boolean } {
  const normalized = normalizeInput(input)
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

export function calcTypingDelay(text: string): number {
  const len = text.length
  const base =
    len < 80 ? 800 + Math.random() * 700
    : len < 180 ? 1500 + Math.random() * 1000
    : 2500 + Math.random() * 1500
  return Math.round(base)
}
