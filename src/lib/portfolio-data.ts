export type PortfolioCategory =
  | 'pos-displays'
  | 'food-packaging'
  | 'alcohol-packaging'
  | 'cosmetics-packaging'
  | 'custom-packaging'

export interface PortfolioItem {
  src: string
  alt: string
  altBg: string
  category: PortfolioCategory
}

export const portfolioItems: PortfolioItem[] = [
  // POS Displays (11)
  { src: '/assets/portfolio/pos-displays/stelaji-1.jpg', alt: 'POS display stand', altBg: 'POS дисплей щанд', category: 'pos-displays' },
  { src: '/assets/portfolio/pos-displays/stelaji-2.jpg', alt: 'Corrugated shelving unit', altBg: 'Гофриран стелаж', category: 'pos-displays' },
  { src: '/assets/portfolio/pos-displays/stelaji-3.jpg', alt: 'Retail display stand', altBg: 'Търговски дисплей', category: 'pos-displays' },
  { src: '/assets/portfolio/pos-displays/stelaji-4.jpg', alt: 'Custom POS display', altBg: 'POS дисплей по поръчка', category: 'pos-displays' },
  { src: '/assets/portfolio/pos-displays/stelaji-5.jpg', alt: 'Branded shelf display', altBg: 'Брандиран рафтов дисплей', category: 'pos-displays' },
  { src: '/assets/portfolio/pos-displays/stelaji-6.jpg', alt: 'Corrugated display stand', altBg: 'Гофриран дисплей щанд', category: 'pos-displays' },
  { src: '/assets/portfolio/pos-displays/stelaji-7.jpg', alt: 'Retail shelving display', altBg: 'Търговски стелаж дисплей', category: 'pos-displays' },
  { src: '/assets/portfolio/pos-displays/stelaji-8.jpg', alt: 'POS display unit', altBg: 'POS дисплей единица', category: 'pos-displays' },
  { src: '/assets/portfolio/pos-displays/pos-display-9.jpg', alt: 'POS rack and stopper display', altBg: 'POS стелаж и стопер', category: 'pos-displays' },
  { src: '/assets/portfolio/pos-displays/pos-display-10.jpg', alt: 'POS shelf stopper', altBg: 'Стопер за рафт', category: 'pos-displays' },
  { src: '/assets/portfolio/food-packaging/hrani-opakovki-5.jpg', alt: 'Countertop product display', altBg: 'Контейнер дисплей за гише', category: 'pos-displays' },

  // Food Packaging (8)
  { src: '/assets/portfolio/food-packaging/hrani-opakovki-1.jpg', alt: 'Food packaging box', altBg: 'Кутия за хранителни продукти', category: 'food-packaging' },
  { src: '/assets/portfolio/food-packaging/hrani-opakovki-3.jpg', alt: 'Custom food box', altBg: 'Нестандартна кутия за храна', category: 'food-packaging' },
  { src: '/assets/portfolio/food-packaging/hrani-opakovki-4.jpg', alt: 'Confectionery display box', altBg: 'Дисплей кутия за сладкарски изделия', category: 'food-packaging' },
  { src: '/assets/portfolio/food-packaging/hrani-opakovki-6.jpg', alt: 'Pizza box packaging', altBg: 'Кутия за пица', category: 'food-packaging' },
  { src: '/assets/portfolio/food-packaging/hrani-opakovki-7.jpg', alt: 'Dairy product display tray', altBg: 'Дисплей тава за млечни продукти', category: 'food-packaging' },
  { src: '/assets/portfolio/food-packaging/hrani-opakovki-8.jpg', alt: 'Butter master carton', altBg: 'Транспортна кутия за масло', category: 'food-packaging' },
  { src: '/assets/portfolio/food-packaging/hrani-opakovki-9.jpg', alt: 'Pastry packaging box', altBg: 'Кутия за сладкиши', category: 'food-packaging' },
  { src: '/assets/portfolio/food-packaging/hrani-opakovki-10.jpg', alt: 'Corrugated fruit tray', altBg: 'Гофрирана тава за плодове', category: 'food-packaging' },

  // Alcohol Packaging (8)
  { src: '/assets/portfolio/food-packaging/hrani-opakovki-12.jpg', alt: 'Craft beer box', altBg: 'Кутия за крафт бира', category: 'alcohol-packaging' },
  { src: '/assets/portfolio/alcohol-packaging/alkohol-paket-1.jpg', alt: 'Wine box packaging', altBg: 'Кутия за вино', category: 'alcohol-packaging' },
  { src: '/assets/portfolio/alcohol-packaging/alkohol-paket-2.jpg', alt: 'Spirits packaging', altBg: 'Опаковка за спиртни напитки', category: 'alcohol-packaging' },
  { src: '/assets/portfolio/alcohol-packaging/alkohol-paket-3.jpg', alt: 'Bag-in-Box packaging', altBg: 'Bag-in-Box опаковка', category: 'alcohol-packaging' },
  { src: '/assets/portfolio/alcohol-packaging/alkohol-paket-4.jpg', alt: 'Luxury wine packaging', altBg: 'Луксозна кутия за вино', category: 'alcohol-packaging' },
  { src: '/assets/portfolio/alcohol-packaging/alkohol-paket-5.jpg', alt: 'Corrugated alcohol packaging', altBg: 'Гофрирана опаковка за алкохол', category: 'alcohol-packaging' },
  { src: '/assets/portfolio/alcohol-packaging/alkohol-paket-6.jpg', alt: 'Premium spirits box', altBg: 'Премиум кутия за спиртни', category: 'alcohol-packaging' },
  { src: '/assets/portfolio/alcohol-packaging/alkohol-paket-7.jpg', alt: 'Alcohol packaging box', altBg: 'Опаковка за алкохол', category: 'alcohol-packaging' },

  // Cosmetics (6)
  { src: '/assets/portfolio/cosmetics-packaging/kozmetika-opakovki-1.jpg', alt: 'Cosmetics packaging box', altBg: 'Козметична опаковка', category: 'cosmetics-packaging' },
  { src: '/assets/portfolio/cosmetics-packaging/kozmetika-opakovki-2.jpg', alt: 'Cosmetics box with laminate finish', altBg: 'Козметична кутия с ламинат', category: 'cosmetics-packaging' },
  { src: '/assets/portfolio/cosmetics-packaging/kozmetika-opakovki-3.jpg', alt: 'Perfumery packaging', altBg: 'Опаковка за парфюмерия', category: 'cosmetics-packaging' },
  { src: '/assets/portfolio/cosmetics-packaging/kozmetika-opakovki-4.jpg', alt: 'Luxury cosmetics box', altBg: 'Луксозна козметична кутия', category: 'cosmetics-packaging' },
  { src: '/assets/portfolio/cosmetics-packaging/kozmetika-opakovki-5.jpg', alt: 'Cosmetics gift packaging', altBg: 'Козметична подаръчна опаковка', category: 'cosmetics-packaging' },
  { src: '/assets/portfolio/cosmetics-packaging/kozmetika-opakovki-6.jpg', alt: 'Premium cosmetics packaging', altBg: 'Премиум козметична опаковка', category: 'cosmetics-packaging' },

  // Custom (3)
  { src: '/assets/portfolio/custom-packaging/nestandartni-opakovki-1.jpg', alt: 'Custom gift packaging', altBg: 'Нестандартна подаръчна опаковка', category: 'custom-packaging' },
  { src: '/assets/portfolio/custom-packaging/nestandartni-opakovki-2.jpg', alt: 'Custom specialty packaging', altBg: 'Нестандартна специализирана опаковка', category: 'custom-packaging' },
]
