
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Zap, Clock, Package } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-20 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Side */}
          <div className="order-2 md:order-1 space-y-6">
            {/* Badge */}
            <div className="bg-gradient-to-r from-red-600 to-amber-500 text-white px-6 py-2 rounded-full w-fit flex items-center gap-2 shadow-lg">
              <Zap className="h-5 w-5" />
              <span>Instant Deliveries anywhere!</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
                Fast & Reliable
              </span><br />
              Deliveries in Your City
            </h1>

            {/* Subtext */}
            <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
              From night snacks to urgent medications - get consumables delivered
              in <span className="font-semibold text-red-600">under 10 minutes</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-red-200 transition-all">
                <ShoppingCart className="mr-2 h-6 w-6" />
                Order Now
              </Button>
              <Button variant="outline" className="border-2 border-gray-200 bg-white/80 hover:bg-white text-gray-600 px-8 py-6 rounded-xl text-lg shadow-sm hover:shadow-md">
                <Package className="mr-2 h-6 w-6" />
                Become a Partner
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-12">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">24/7</p>
                  <p className="text-gray-600">Availability</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">500K+</p>
                  <p className="text-gray-600">Deliveries Made</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Content - Right Side */}
          <div className="order-1 md:order-2 relative group">
            <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden border-8 border-red-100 shadow-2xl">
              <Image
                src="/images/banner-image.jpg"
                alt="Delivery"
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-red-600/20 to-amber-500/20" />

              {/* Floating Badge */}
              <div className="absolute top-6 left-6 bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold text-gray-900">10min</span>
                <span className="text-gray-600">Average Delivery</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-400 rounded-full opacity-20 mix-blend-multiply" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-red-400 rounded-full opacity-20 mix-blend-multiply" />
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>
    </section>
  );
}