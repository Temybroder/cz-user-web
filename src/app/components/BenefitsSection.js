
import Image from "next/image";

export default function BenefitsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-20">
          Partner with Conzooming for growth
        </h2>

        <div className="flex flex-col lg:flex-row gap-7">
          {/* Left Panel */}
          <div className="lg:w-[430px] h-[600px] bg-[#28C2C2] rounded-3xl p-8 flex flex-col text-white shadow-xl">
            <div className="bg-white/20 text-white font-semibold px-4 py-2 rounded-full w-fit text-sm mb-4">
              Menu management
            </div>
            <h3 className="text-3xl font-bold leading-tight mb-4">
              Effortlessly manage your menu
            </h3>
            <p className="text-white/90 text-base mb-10">
              Create multiple categories, add options to menu items, and mark items out of stock.
            </p>
            <div className="mt-auto relative h-72 mx-auto w-full max-w-[300px]">
              <Image
                src="/images/menu-screen.png"
                alt="Menu management"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 space-y-7">
            {/* Top Right Sub-Panel */}
            <div className="h-[280px] w-full bg-amber-400 rounded-3xl p-8 flex justify-between items-start shadow-xl">
              <div className="max-w-md space-y-4">
                <div className="bg-white/20 text-white font-semibold px-4 py-2 rounded-full w-fit text-sm">
                  Receive and withdraw
                </div>
                <h3 className="text-3xl font-bold text-white">
                  Collect payment and withdraw
                </h3>
                <p className="text-white/90">
                  Create multiple categories, add options to menu items, and mark items out of stock.
                </p>
              </div>
              <div className="relative h-full w-[180px]">
                <Image
                  src="/images/payment-screen.png"
                  alt="Payments"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            {/* Bottom Right Sub-Panel */}
            <div className="h-[280px] w-full bg-gray-100 rounded-3xl p-8 flex justify-between items-start shadow-lg">
              <div className="max-w-md space-y-4">
                <div className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-full w-fit text-sm">
                  Earning target
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  Set earning target
                </h3>
                <p className="text-gray-700">
                  Define your earning goals and track progress effortlessly, helping you stay focused and motivated.
                </p>
              </div>
              <div className="relative h-full w-[180px]">
                <Image
                  src="/images/earnings-screen.png"
                  alt="Earnings"
                  fill
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
