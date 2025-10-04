import { Providers } from "./providers"
import Navbar from "@/app/components/Navbar";
import HeroSection from "@/app/components/HeroSection";
import OverviewSection from "@/app/components/OverviewSection";
import WhySection from "@/app/components/WhySection";
import GrowthSection from "@/app/components/GrowthSection";
import ExploreSection from "@/app/components/ExploreSection";
import FAQSection from "@/app/components/FAQSection";
import BannerSection from "@/app/components/BannerSection";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
     <Providers>
    <main className="relative">
      <Navbar />
      <div className="mx-4 sm:mx-6 lg:mx-8 xl:mx-10 2xl:mx-12">
      <HeroSection />
      <OverviewSection />
      <WhySection />
      <GrowthSection />
      <ExploreSection />
      <BannerSection/>
      <FAQSection />
      </div>
      <Footer />
    </main>
    </Providers>
  );
}