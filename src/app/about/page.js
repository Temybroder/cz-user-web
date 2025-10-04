
// app/about/page.jsx
'use client';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FAQSection from "../components/FAQSection";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Rocket, Utensils, Pill, Leaf, Quote, User, Globe, HeartHandshake, Trophy } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white">
       <Navbar />
      {/* Animated Banner Section */}
      <BannerSection />

      {/* Modern Founder Section */}
      <FounderSection />

      {/* Values Section with Animations */}
      <ValuesSection />
      <FAQSection />
      <Footer />
    </div>
  );
}

function BannerSection() {
  return (
    <section className="relative bg-cream py-32 overflow-hidden">
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedIcon icon={<Utensils className="w-8 h-8 text-primary" />} x={20} y={30} />
        <AnimatedIcon icon={<Pill className="w-8 h-8 text-secondary-dark" />} x={80} y={70} />
        <AnimatedIcon icon={
            <>
            <Image
            src="/images/food-veggies.png"
            alt="Food Icon"
            className="w-8 h-8 object-contain"
            width={50}
            height={50}
          />
          </>
            } x={50} y={80} />
        <AnimatedIcon icon={<HeartHandshake className="w-8 h-8 text-secondary-dark" />} x={90} y={40} />
      </div>

      <div className="container px-4 sm:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <div className="bg-red-600 text-white px-6 py-2 rounded-full w-fit mx-auto flex items-center gap-3 shadow-lg">
            <div className="relative w-4 h-4">
              <div className="absolute inset-0 bg-primary rounded-full animate-pulse" />
              <div className="absolute inset-[3px] bg-white rounded-full" />
            </div>
            <span>For all consumables</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Seamless ordering
            <span className="bg-gradient-to-r from-primary to-secondary-dark bg-clip-text text-transparent block mt-2">
              Your way, delivered daily
            </span>
          </h1>

          <p className="text-xl text-gray-600 md:text-2xl max-w-2xl mx-auto">
            Revolutionizing access to essentials through smart technology
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {/* <Button className="bg-gradient-to-r from-primary to-secondary-dark hover:from-primary/90 hover:to-secondary-dark/90 text-white px-8 py-6 gap-2 text-lg shadow-xl shadow-primary/20 transition-all"> */}

            <Button className="bg-gradient-to-r from-primary to-secondary-dark hover:from-primary/90 hover:to-secondary-dark/90 text-white px-8 py-6 gap-2 text-lg shadow-xl shadow-primary/20 transition-all">
            Get Started Now
              <Rocket className="w-5 h-5 animate-bounce" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FounderSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 sm:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16 items-center bg-gradient-to-br from-primary/5 to-secondary-dark/5 rounded-3xl p-12 shadow-inner"
        >
          {/* Founder Image */}
          <div className="relative w-[400px] h-[400px] rounded-2xl overflow-hidden border-4 border-white shadow-2xl hover:shadow-primary/20 transition-shadow">
            <Image
              src="/images/founder.png"
              alt="Founder"
              fill
              className="object-cover grayscale hover:grayscale-0 transition-all"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
          </div>

          {/* Founder Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-6 py-2 rounded-full">
              <Trophy className="w-5 h-5" />
              <span>Pioneering Since 2020</span>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Redefining Urban
              <span className="bg-gradient-to-r from-primary to-secondary-dark bg-clip-text text-transparent"> feeding</span>
            </h2>

            <div className="relative pl-8 border-l-4 border-primary/20">
              <Quote className="w-8 h-8 text-primary/30 absolute left-0 -top-2" />
              <p className="text-xl text-gray-600">
              Conzooming was born from my personal frustration with finding healthy,
              satisfying lunch options in a busy office environment. Faced with overpriced,
               meals which I couldn&#39;t tailor to my taste, I realized many of my colleagues
               shared the same struggle. This sparked the idea for a lunch subscription
               service delivering fresh, delicious meals to busy consumers.

                What started as a simple Google Forms initiative, where colleagues shared
                their meal preferences, quickly grew into a success. Our vendors served high-quality
                 meals using the freshest ingredients according to customer request. The overwhelming
                  demand showed that the need was bigger than just our office.
                As we evolved into what is now Conzooming, we shifted to a scalable model; partnering
                with trusted vendors to meet diverse meal preferences and needs.

                Conzooming is now about more than just meals — it is about ensuring everyone can hope
                for a healthy, satisfying lunch, and delivery, no matter how hectic life gets. Because
                life may be busy, but getting your meals and other needs shouldn&#39;t be.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <User className="w-6 h-6 text-primary" />
                Temitope Agboola
              </h3>
              <p className="text-gray-500 font-medium">Founder/CEO</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center space-y-8 mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900">
            Core Values
            <span className="bg-gradient-to-r from-primary to-secondary-dark bg-clip-text text-transparent block mt-2">
              Driving Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            The principles guiding every innovation at Conzooming
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <ValueCard
            title="Customer First"
            icon={<HeartHandshake className="w-8 h-8" />}
            color="bg-primary/20"
            text="Every decision starts with customer needs and experience"
          />
          <ValueCard
            title="Sustainable Growth"
            icon={<Leaf className="w-8 h-8" />}
            color="bg-secondary-dark/20"
            text="Building eco-friendly solutions for lasting impact"
          />
          <ValueCard
            title="Tech Innovation"
            icon={<Globe className="w-8 h-8" />}
            color="bg-blue-600/20"
            text="Leveraging cutting-edge technology for smarter solutions"
          />
        </div>
      </div>
    </section>
  );
}

function ValueCard({ title, icon, color, text }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
    >
      <div className={`${color} w-fit p-4 rounded-xl mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </motion.div>
  );
}

function AnimatedIcon({ icon, x, y }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {icon}
    </motion.div>
  );
}