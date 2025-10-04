import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Apple, Download } from "lucide-react";
import GooglePlayIcon from "@/components/ui/GooglePlayIcon";

export default function RideSection() {
    return (
      <section className="py-20 bg-rose-50">
        <div className="container px-4 sm:px-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Join Conzooming as a rider
          </h2>

          <div className="grid lg:grid-cols-[800px_430px] gap-7 justify-center">
            {/* Left Container */}
            <div className="space-y-7">
              {/* Upper Card */}
              <div className="bg-secondary-dark h-[280px] rounded-2xl p-8 flex">
                <div className="w-1/2 space-y-6">
                  <div className="bg-black text-white px-4 py-1 rounded-full w-fit">
                    Earn more
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Increased earning possibilities
                  </h3>
                  <p className="text-gray-600">
                    Enjoy the opportunity to earn competitive income with flexible hours,
                    maximizing your earnings while balancing your schedule.
                  </p>
                </div>
                <div className="w-1/2 relative">
                  <Image
                    src="/images/app-screen-riders.png"
                    alt="Earnings app screen"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Lower Card */}
              <div className="bg-gray-100 h-[280px] rounded-2xl p-8 flex">
                <div className="w-1/2 space-y-6">
                  <div className="bg-primary/20 text-primary px-4 py-1 rounded-full w-fit">
                    Customer Support
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">24/7 Support</h3>
                  <p className="text-gray-600">
                    Need assistance or facing an issue? Just chat with us through the rider app
                  </p>
                </div>
                <div className="w-1/2 relative">
                  <Image
                    src="/images/app-screen-customers.png"
                    alt="Support app screen"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right Container */}
            <div className="bg-[#28C2C2] h-[600px] rounded-2xl p-8 flex flex-col">
              <div className="space-y-6 mb-8">
                <div className="bg-primary text-white px-4 py-1 rounded-full w-fit">
                  Easy and secure
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Secured withdrawals</h3>
                <p className="text-gray-600">
                  Enjoy hassle-free withdrawals directly to your account, ensuring quick
                  access to your earnings whenever you need them
                </p>
              </div>
              <div className="relative flex-1 mt-8">
                <Image
                  src="/images/earnings-screen.png"
                  alt="Withdrawals app screen"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Gradient Banner */}
          <div className="mt-15 bg-gradient-to-r from-primary to-secondary-dark rounded-2xl p-12 mt-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-white">
                <h2 className="text-3xl font-bold">Join Conzooming as a rider</h2>
                <p className="text-lg">To join Conzooming as a rider</p>
                <ul className="space-y-3 list-disc pl-6">
                  <li>You must be at least 18 years old</li>
                  <li>Must have a Smartphone (Android or iOS)</li>
                  <li>You must own a bicycle, motorcycle or car with the right license and insurance</li>
                </ul>
              </div>
              <div className="relative aspect-square">
                <Image
                  src="/images/app-rider-helmet.png"
                  alt="Rider helmet"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }