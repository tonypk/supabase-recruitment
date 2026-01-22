export const metadata = {
  title: 'Recruitment Tracking System',
  description: 'Simple ATS powered by Supabase'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', padding: 40 }}>
        {children}
      </body>
    </html>
  )
}