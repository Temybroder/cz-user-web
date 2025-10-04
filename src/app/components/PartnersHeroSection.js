
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Apple } from "lucide-react";
import GooglePlayIcon from "@/components/ui/GooglePlayIcon";

export default function PartnersHeroSection() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-rose via-cream to-lemon">
      <div className="container px-4 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10 max-w-[620px]">
            {/* Badge */}
            <div className="bg-amber-50 text-red-600 px-6 py-2 rounded-full w-fit flex items-center gap-3 shadow-md">
              <div className="relative w-4 h-4">
                <div className="absolute inset-0 bg-red-600 rounded-full animate-ping" />
                <div className="absolute inset-[3px] bg-white rounded-full z-10" />
              </div>
              <span className="text-sm font-semibold">Serve more, earn more</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Take your business <br />
              <span className="text-red-600">to the next level</span>
            </h1>

            {/* Paragraph */}
            <p className="text-lg text-gray-700 leading-relaxed">
              Reach more customers and <span className="bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent font-medium">boost your revenue</span> by joining our growing network of partners.
              Let your business shine with Conzooming.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-6 pt-2">
              <Button className="bg-primary-light hover:bg-red-500 text-white px-8 py-5 gap-4 text-base shadow-md rounded-xl">
                <GooglePlayIcon className="w-5 h-5" />
                Google Play
              </Button>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-5 gap-4 text-base shadow-md rounded-xl">
                <Apple className="w-5 h-5" />
                App Store
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full lg:max-w-[580px] aspect-square rounded-3xl overflow-hidden shadow-xl border border-cream">
            <Image
              src="/images/partners-hero.png"
              alt="Business growth"
              fill
              className="object-contain p-6"
              priority
              sizes="(max-width: 1024px) 100vw, 580px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
