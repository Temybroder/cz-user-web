
import Image from "next/image";
import { Smartphone, Upload, Package } from "lucide-react";

export default function OnboardingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black text-white px-6 py-2 rounded-full w-fit mb-6">
            How it works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-black">
            Get Onboarded easily
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 - Register */}
            <div className="text-center p-6 rounded-2xl border hover:bg-gradient-to-b hover:from-yellow-100 hover:to-red-50 transition-colors shadow-sm">
              <div className="w-24 h-24 bg-orange-100 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-inner">
                <Smartphone className="w-12 h-12 text-orange-600" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-black">Register</h4>
              <p className="text-gray-600">
                Register on our platform, and we will verify your details to get you started
              </p>
            </div>

            {/* Step 2 - Upload Menu */}
            <div className="text-center p-6 rounded-2xl border hover:bg-gradient-to-b hover:from-yellow-100 hover:to-red-50 transition-colors shadow-sm">
              <div className="w-24 h-24 bg-lime-100 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-inner">
                <Upload className="w-12 h-12 text-lime-600" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-black">Upload menu</h4>
              <p className="text-gray-600">
                After approval, you can upload your food items (menu, products, etc.) into their respective categories
              </p>
            </div>

            {/* Step 3 - Accept Orders */}
            <div className="text-center p-6 rounded-2xl border hover:bg-gradient-to-b hover:from-yellow-100 hover:to-red-50 transition-colors shadow-sm">
              <div className="w-24 h-24 bg-amber-100 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-inner">
                <Package className="w-12 h-12 text-amber-700" />
              </div>
              <h4 className="text-2xl font-semibold mb-4 text-black">Accept Orders</h4>
              <p className="text-gray-600">
                Orders will be received through the consumer app, allowing you to accept and prepare them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
