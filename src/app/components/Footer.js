
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, Apple, MapPin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import GooglePlayIcon from "@/components/ui/GooglePlayIcon"

export default function Footer() {
  const links = {
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
    ],
    'Quick Links': [
      { name: 'Partners', href: '/partners' },
      { name: 'Riders', href: '/riders' },
      { name: 'Support', href: '/support' },
    ]
  }

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-red-500 blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-yellow-500 blur-3xl"></div>
      </div>

      <div className="container px-4 py-16 mx-auto relative z-10">
        {/* Main footer content - using flex instead of grid for better control */}
        <div className="flex flex-col md:flex-row flex-wrap gap-8 justify-between">
          {/* Brand column - fixed width */}
          <div className="w-full md:w-[280px] space-y-6">
            <div className="mb-4">
              <Link href="/" className="inline-block">
                <Image
                  src="/images/footer-logo.png"
                  width={180}
                  height={60}
                  alt="Conzooming"
                  className="hover:scale-105 transition-transform"
                />
              </Link>
            </div>

            <div className="space-y-3 text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
                <p>4, Deji Olamiju Street, Gbagada</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
                <p>support@conzooming.com</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-white" />
                <p>+(234) 808-301-9993</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {[
                { icon: Facebook, color: 'hover:bg-blue-600' },
                { icon: Twitter, color: 'hover:bg-sky-500' },
                { icon: Instagram, color: 'hover:bg-gradient-to-tr from-yellow-500 to-pink-600' },
                { icon: Linkedin, color: 'hover:bg-blue-700' }
              ].map(({icon: Icon, color}, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`p-2 transition-all duration-300 rounded-full bg-gray-900 ${color} hover:scale-110`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="sr-only">{Icon.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation columns - middle sections */}
          <div className="flex flex-1 flex-wrap gap-8 min-w-[300px] justify-between">
            {Object.entries(links).map(([title, items]) => (
              <div key={title} className="min-w-[120px] space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-red-500 pb-2 w-fit">
                  {title}
                </h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 text-white/80 hover:text-red-500 transition-colors group"
                      >
                        <span className="w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* App download column - rightmost section with fixed width */}
          <div className="w-full md:w-[280px] space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-yellow-500 pb-2 w-fit">
              Get The App
            </h3>
            <div className="space-y-4">
              <Button
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg px-6 py-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
              >
                <Apple className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-xs">Download on the</p>
                  <p className="font-bold">App Store</p>
                </div>
              </Button>

              <Button
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white rounded-lg px-6 py-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
              >
                <GooglePlayIcon className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-xs">Get it on</p>
                  <p className="font-bold">Google Play</p>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-12 mt-12 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} Conzooming. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <Link href="/terms" className="text-white/60 hover:text-red-500 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-white/60 hover:text-red-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-white/60 hover:text-red-500 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-white/60 hover:text-red-500 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}








// import Link from "next/link"
// import Image from "next/image"
// import { Facebook, Instagram, Twitter, Linkedin, Apple, MapPin, Mail, Phone } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import GooglePlayIcon from "@/components/ui/GooglePlayIcon"

// export default function Footer() {
//   const links = {
//     Company: [
//       { name: 'About Us', href: '/about' },
//       { name: 'Careers', href: '/careers' },
//       { name: 'Blog', href: '/blog' },
//     ],
//     'Quick Links': [
//       { name: 'Partners', href: '/partners' },
//       { name: 'Riders', href: '/riders' },
//       { name: 'Support', href: '/support' },
//     ],
//     Services: [
//       { name: 'Restaurants', href: '/restaurants' },
//       { name: 'Groceries', href: '/groceries' },
//       { name: 'Pharmacy', href: '/pharmacy' },
//     ]
//   }

//   return (
//     <footer className="bg-black text-white relative overflow-hidden">
//       {/* Decorative elements */}
//       <div className="absolute top-0 left-0 w-full h-full opacity-5">
//         <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-red-500 blur-3xl"></div>
//         <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-yellow-500 blur-3xl"></div>
//       </div>

//       <div className="container px-4 py-16 mx-auto relative z-10">
//         {/* Main footer content */}
//         <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
//           {/* Brand column */}
//           <div className="space-y-6">
//             <Link href="/" className="inline-block">
//               <div className="relative w-48 h-12">
//                 <Image
//                   src="/images/footer-logo.png"
//                   width={180}
//                   height={60}
//                   alt="Conzooming"
//                   className="hover:scale-105 transition-transform"
//                 />
//               </div>
//             </Link>

//             <div className="space-y-3 text-white/80">
//               <div className="flex items-start gap-3">
//                 <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
//                 <p>4, Deji Olamiju Street, Gbagada</p>
//               </div>
//               <div className="flex items-start gap-3">
//                 <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500" />
//                 <p>support@conzooming.com</p>
//               </div>
//               <div className="flex items-start gap-3">
//                 <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-white" />
//                 <p>+(234) 808-301-9993</p>
//               </div>
//             </div>

//             {/* Social links with hover animations */}
//             <div className="flex gap-3 pt-2">
//               {[
//                 { icon: Facebook, color: 'hover:bg-blue-600' },
//                 { icon: Twitter, color: 'hover:bg-sky-500' },
//                 { icon: Instagram, color: 'hover:bg-gradient-to-tr from-yellow-500 to-pink-600' },
//                 { icon: Linkedin, color: 'hover:bg-blue-700' }
//               ].map(({icon: Icon, color}, index) => (
//                 <Link
//                   key={index}
//                   href="#"
//                   className={`p-2 transition-all duration-300 rounded-full bg-gray-900 ${color} hover:scale-110`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span className="sr-only">{Icon.name}</span>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* Navigation columns */}
//           {Object.entries(links).map(([title, items]) => (
//             <div key={title} className="space-y-4">
//               <h3 className="text-lg font-bold text-white border-b border-red-500 pb-2 w-fit">
//                 {title}
//               </h3>
//               <ul className="space-y-3">
//                 {items.map((item) => (
//                   <li key={item.name}>
//                     <Link
//                       href={item.href}
//                       className="flex items-center gap-2 text-white/80 hover:text-red-500 transition-colors group"
//                     >
//                       <span className="w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
//                       {item.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}

//           {/* App download column */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-bold text-white border-b border-yellow-500 pb-2 w-fit">
//               Get The App
//             </h3>
//             <div className="space-y-4">
//               <Button
//                 className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-lg px-6 py-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
//               >
//                 <Apple className="w-5 h-5" />
//                 <div className="text-left">
//                   <p className="text-xs">Download on the</p>
//                   <p className="font-bold">App Store</p>
//                 </div>
//               </Button>

//               <Button
//                 className="w-full bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white rounded-lg px-6 py-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
//               >
//                 <GooglePlayIcon className="w-5 h-5" />
//                 <div className="text-left">
//                   <p className="text-xs">Get it on</p>
//                   <p className="font-bold">Google Play</p>
//                 </div>
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Bottom section */}
//         <div className="pt-12 mt-12 border-t border-gray-800">
//           <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
//             <p className="text-sm text-white/60">
//               © {new Date().getFullYear()} Conzooming. All rights reserved.
//             </p>

//             <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
//               <Link href="/terms" className="text-white/60 hover:text-red-500 transition-colors">
//                 Terms of Service
//               </Link>
//               <Link href="/privacy" className="text-white/60 hover:text-red-500 transition-colors">
//                 Privacy Policy
//               </Link>
//               <Link href="/cookies" className="text-white/60 hover:text-red-500 transition-colors">
//                 Cookie Policy
//               </Link>
//               <Link href="/sitemap" className="text-white/60 hover:text-red-500 transition-colors">
//                 Sitemap
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   )
// }

