import { Providers } from './providers'

// Add environment variable validation
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Log missing critical environment variables in production
  const missingVars = [];
  if (!process.env.NEXT_PUBLIC_DEFAULT_VIDEO_PROVIDER) {
    console.warn('Missing NEXT_PUBLIC_DEFAULT_VIDEO_PROVIDER, using fallback: twilio');
  }
  // Add other critical environment variables here
  if (!process.env.TWILIO_API_KEY_SID && !process.env.NEXT_PUBLIC_MOCK_VIDEO_ENABLED) {
    console.warn('Missing TWILIO_API_KEY_SID, video calls may not work correctly');
  }
  if (!process.env.TWILIO_API_KEY_SECRET && !process.env.NEXT_PUBLIC_MOCK_VIDEO_ENABLED) {
    console.warn('Missing TWILIO_API_KEY_SECRET, video calls may not work correctly');
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}  