export const FOUNDING_YEAR = 1995

export function getYearsSince(foundingYear: number = FOUNDING_YEAR): number {
  return new Date().getFullYear() - foundingYear
}

/**
 * PLACEHOLDER — replace with the confirmed figures from the Google Business
 * dashboard. The report's own supplied snapshot was ambiguous, so this uses
 * the closest real value it gave (4.7) with a clearly placeholder review count.
 */
export const GOOGLE_RATING = {
  score: 4.7,
  reviewCount: '200+',
  // TODO: replace with the real Google Maps/Business review URL once confirmed
  url: null as string | null,
}
