// "use client"

// import { AppProvider } from "@/context/app-context"
// import RootLayoutClient from "@/app/components/root-layout-client"

// export function AppProviderWrapper({ children }) {
//   return (
//     <AppProvider>
//       <RootLayoutClient>{children}</RootLayoutClient>
//     </AppProvider>
//   )
// }








// "use client"

// import { AppProvider } from "@/context/app-context"
// import RootLayoutClient from "@/app/components/root-layout-client"

// export function AppProviderWrapper({ children }) {
//   return (
//     <AppProvider>
//       <RootLayoutClient>{children}</RootLayoutClient>
//     </AppProvider>
//   )
// }






"use client"

import { AppProvider } from "@/context/app-context"
import RootLayoutClient from "@/app/components/root-layout-client"

export function AppProviderWrapper({ children }) {
  console.log("AppProviderWrapper rendering")
  return (
    <AppProvider>
      <RootLayoutClient>{children}</RootLayoutClient>
    </AppProvider>
  )
}
