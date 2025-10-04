import { Providers } from "./providers"

export default function PageWrapper({ children }) {
  return <Providers>{children}</Providers>
}
