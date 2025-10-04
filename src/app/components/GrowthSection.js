
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Rocket, Zap, BarChart, Users, Smile, Wallet } from "lucide-react";

export default function GrowthSection() {
  const stats = [
    { value: "95%", label: "Partner Satisfaction" },
    { value: "2.5x", label: "Earning Potential" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <section className="relative overflow-hidden py-28 bg-gradient-to-b from-red-50 to-amber-50">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
            Accelerate Your Success
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-prose mx-auto">
            Join a network that is redefining service excellence. Scale your business with
            cutting-edge tools and endless possibilities.
          </p>
          <div className="inline-flex items-center gap-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-red-200 transition-all">
              <Rocket className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-600 px-8 py-6 rounded-xl hover:bg-white/50">
              <BarChart className="mr-2 h-5 w-5" />
              View Metrics
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Features */}
          <div className="space-y-8">
            <div className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex gap-6">
                <div className="bg-red-100 p-4 rounded-xl">
                  <Zap className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Dynamic Earnings</h3>
                  <p className="text-gray-600">
                    Smart algorithms maximize your earning potential based on demand patterns
                    and performance metrics.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex gap-6">
                <div className="bg-amber-100 p-4 rounded-xl">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">Expanding Network</h3>
                  <p className="text-gray-600">
                    Grow with our constantly evolving ecosystem of partners and customers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="bg-gradient-to-br from-red-600 to-amber-500 rounded-3xl p-8 shadow-2xl">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 mb-12">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-red-100">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Highlight Card */}
              <div className="bg-amber-100/20 p-6 rounded-xl border border-amber-200/30">
                <div className="flex items-center gap-4">
                  <Smile className="h-12 w-12 text-amber-300" />
                  <div>
                    <h4 className="text-lg font-semibold text-white">Happy Partners</h4>
                    <p className="text-amber-100 text-sm">
                      Join our community of satisfied service providers
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA at Bottom */}
              <div className="mt-8">
                <Button className="w-full bg-white text-red-600 hover:bg-gray-50 h-14 rounded-xl font-semibold">
                  <Wallet className="mr-2 h-5 w-5" />
                  Start Earning Today
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Animation */}
        <div className="mt-20 flex justify-center animate-float">
          <div className="bg-white p-4 rounded-full shadow-2xl">
            <div className="bg-gradient-to-r from-red-600 to-amber-500 p-4 rounded-full">
              <BarChart className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}