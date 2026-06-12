// Proper Window augmentation for Google Analytics gtag
// Replaces unsafe `as unknown as` casts in Chatbot.tsx

interface Window {
  gtag: (
    command: 'event' | 'config' | 'set' | 'js',
    target: string | Date,
    params?: Record<string, string | number | boolean | undefined>
  ) => void
  dataLayer: unknown[]
}
