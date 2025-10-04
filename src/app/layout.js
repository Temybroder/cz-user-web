import { Inter } from "next/font/google"
import "./globals.css"
import { AppProviderWrapper } from "@/context/app-provider-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Conzooming - Order & Delivery System",
  description: "Order food, groceries, drinks, and medications from vendors near you",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviderWrapper>{children}</AppProviderWrapper>
      </body>
    </html>
  )
}










// import { Inter } from "next/font/google"
// import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "Conzooming - Order & Delivery System",
//   description: "Order food, groceries, drinks, and medications from vendors near you",
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   )
// }



















// import { Inter } from "next/font/google"
// import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "Conzooming - Order & Delivery System",
//   description: "Order food, groceries, drinks, and medications from vendors near you",
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   )
// }













// import { Inter } from "next/font/google"
// import { AppProviderWrapper } from "@/context/app-provider-wrapper"
// import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "Conzooming - Order & Delivery System",
//   description: "Order food, groceries, drinks, and medications from vendors near you",
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AppProviderWrapper>{children}</AppProviderWrapper>
//       </body>
//     </html>
//   )
// }







// import { Inter } from "next/font/google"
// import { AppProvider } from "@/context/app-context"
// import RootLayoutClient from "@/app/components/root-layout-client"
// import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "Conzooming - Order & Delivery System",
//   description: "Order food, groceries, drinks, and medications from vendors near you",
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <AppProvider>
//           <RootLayoutClient>{children}</RootLayoutClient>
//         </AppProvider>
//       </body>
//     </html>
//   )
// }
