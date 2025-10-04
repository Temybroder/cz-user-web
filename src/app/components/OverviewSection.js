 "use client";
import Image from "next/image";
import GooglePlayIcon from "@/components/ui/GooglePlayIcon";
import { Smartphone, Store, Bike, ArrowRight, Apple, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const cards = [
  {
    title: "For Customers",
    icon: <Smartphone className="w-8 h-8 text-blue-600" />,
    text: "Discover top restaurants and vendors near you with instant delivery in minutes",
    image: "/images/app-screen-customers.png",
    color: "bg-red-50",
    cta: "Explore Apps"
  },
  {
    title: "For Partners",
    icon: <Store className="w-8 h-8 text-amber-600" />,
    text: "Expand your business with smart tools for menu management and multi-branch operations",
    image: "/images/app-screen-partners.png",
    color: "bg-amber-50",
    cta: "Join Partners"
  },
  {
    title: "For Riders",
    icon: <Bike className="w-8 h-8 text-red-600" />,
    text: "Flexible earning opportunities with real-time tracking and instant withdrawals",
    image: "/images/app-screen-riders.png",
    color: "bg-blue-50",
    cta: "Start Riding"
  },
];

export default function OverviewSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              Unified Platform,
            </span><br />
            Endless Possibilities
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Transforming every aspect of the delivery experience
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`${card.color} p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{card.title}</h3>
              </div>

              <div className="relative h-60 mb-8 -mx-8">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  quality={100}
                />
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{card.text}</p>

              <Button
                variant="outline"
                className="w-full bg-white hover:bg-gray-50 h-12 rounded-xl border-gray-200 flex justify-between items-center"
              >
                <span>{card.cta}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>

        {/* Unified CTA Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-amber-600" />
                <h3 className="text-3xl font-bold text-gray-900">Get Started Now</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-gray-600">24/7 Support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-gray-600">Secure Payments</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Button className="bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-xl flex items-center gap-3">
                <GooglePlayIcon alt="Google Play" className="w-6 h-6" />
                <div className="text-left">
                  <span className="text-xs font-medium">Get on</span>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </Button>

              <Button className="bg-gray-900 hover:bg-gray-800 h-14 px-8 rounded-xl flex items-center gap-3">
                <Apple src="/apple-logo.svg" alt="App Store" className="w-6 h-6" />
                <div className="text-left">
                  <span className="text-xs font-medium">Download on</span>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}