
// app/riders/page.jsx
import Navbar from "@/app/components/Navbar";
import RidersHeroSection from "@/app/components/RidersHeroSection";
import RideSection from "@/app/components/RiderRideSection";
import FAQSection from "../components/FAQSection";
import RidersOnbardingSection from "@/app/components/RidersOnboardingSection";
import Footer from "@/app/components/Footer";

export default function RidersPage() {
     return (
     <main className="relative">
      <Navbar />

      {/* Hero Section */}
      <RidersHeroSection />

      {/* Ride with Conzooming Section */}
      <RideSection />

      {/* Gradient CTA Section */}
      {/* <CTASection /> */}

      {/* Onboarding Section */}
      <RidersOnbardingSection />
      <FAQSection/>
      <Footer/>
    </main>
  );
}
