import { Provider } from "@/components/ui/provider"

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
