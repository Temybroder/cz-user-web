import Navbar from '@/app/components/Navbar';
import PartnersHeroSection from '@/app/components/PartnersHeroSection';
import BenefitsSection from '@/app/components/BenefitsSection';
import OnboardingSection from '@/app/components/OnboardingSection';
import FAQSection from "@/app/components/FAQSection";
import BannerSection from "@/app/components/BannerSection";
import Footer from "@/app/components/Footer";
import Image from 'next/image';


export default function PartnersPage() {
    return (
      <main className="relative">
        <Navbar />

          <PartnersHeroSection/>
          <BenefitsSection />
          <OnboardingSection />
          <FAQSection />
          <BannerSection />


        <Footer />
      </main>
    );
  }