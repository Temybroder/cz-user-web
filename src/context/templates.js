import ClientProvider from "@/app/components/client-provider"
import ClientLayout from "@/app/components/client-layout"

export default function Template({ children }) {
  return (
    <ClientProvider>
      <ClientLayout>{children}</ClientLayout>
    </ClientProvider>
  )
}
