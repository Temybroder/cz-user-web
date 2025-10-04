import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Apple, Download } from "lucide-react";
import GooglePlayIcon from "@/components/ui/GooglePlayIcon";

export default function RidersHeroSection() {
  return (
    <section className="pt-20 pb-24">
      <div className="container px-4 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 max-w-[600px]">
            <div className="bg-primary/20 text-primary px-6 py-2 rounded-full w-fit flex items-center gap-3">
              <div className="relative w-4 h-4">
                <div className="absolute inset-0 bg-primary rounded-full" />
                <div className="absolute inset-[3px] bg-white rounded-full" />
              </div>
              <span>Deliver smiles</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Drive with us, deliver happiness
            </h1>

            <p className="text-xl text-gray-600">
              Join Conzoomings growing network of riders and be your own boss
            </p>

            <div className="flex flex-wrap gap-6">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 gap-4">
                <GooglePlayIcon className="w-6 h-6" />
                Download on Google Play
              </Button>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 gap-4">
                <Apple className="w-6 h-6" />
                Download on App Store
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:max-w-[600px] aspect-square">
            <Image
              src="/images/rider-hero.png"
              alt="Rider delivering"
              fill
              className="object-contain p-8"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}