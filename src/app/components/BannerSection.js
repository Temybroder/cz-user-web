"use client";
import Image from "next/image";
import { MousePointerClick, Apple } from "lucide-react";
import GooglePlayIcon from "@/components/ui/GooglePlayIcon";

export default function InstantOrderSection() {
  return (
    <section className="relative py-12"> {/* Reduced vertical height */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-[#3D2E2C] rounded-2xl lg:rounded-[2rem] overflow-hidden h-[500px]"> {/* Fixed container height */}
          {/* Abstract Donut Shape */}
          <div className="absolute top-[-30px] left-[-30px] w-48 h-48 bg-red-500/20 rounded-full blur-3xl animate-pulse" />

          <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-8 p-8 lg:p-12">
            {/* Left Content */}
            <div className="relative z-10 flex-1 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <MousePointerClick className="w-7 h-7 text-red-400" />
                <h3 className="text-2xl lg:text-3xl font-bold text-white">
                  Order instantly with<br className="hidden lg:block" /> just a click
                </h3>
              </div>

              {/* App Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-white/90 hover:bg-white backdrop-blur-sm transition-all duration-300 rounded-lg px-5 py-3 flex items-center gap-2 shadow-md hover:shadow-lg">
                  <Apple className="w-5 h-5 text-gray-900" />
                  <div className="text-left">
                    <p className="text-xs text-gray-600">Download on the</p>
                    <p className="text-sm font-semibold text-gray-900">App Store</p>
                  </div>
                </button>

                <button className="bg-white/90 hover:bg-white backdrop-blur-sm transition-all duration-300 rounded-lg px-5 py-3 flex items-center gap-2 shadow-md hover:shadow-lg">
                  <GooglePlayIcon className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-xs text-gray-600">Get it on</p>
                    <p className="text-sm font-semibold text-gray-900">Google Play</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Content - Phone Screens */}
            <div className="flex-1 w-full h-full relative">
              <div className="absolute bottom-0 right-0 h-[85%] flex items-end">
                {/* First Screen */}
                <div className="relative z-20" style={{ width: '45%', marginRight: '-7px' }}>
                  <div className="aspect-[9/19]">
                    <Image
                      src="/images/iphone1.png"
                      alt="App interface"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Second Screen */}
                <div className="relative z-10" style={{
                  width: '50%',
                  marginLeft: '-7px',
                  right: '20px' // 20px from right wall
                }}>
                  <div className="aspect-[9/19]">
                    <Image
                      src="/images/iphone2.png"
                      alt="App interface"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-6 right-6 w-20 h-20 bg-red-400/10 rounded-full blur-xl" />
          <div className="absolute top-1/3 left-1/4 w-28 h-28 bg-amber-400/10 rounded-full blur-xl" />
        </div>
      </div>
    </section>
  );
}