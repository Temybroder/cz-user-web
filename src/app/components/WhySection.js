
import Image from "next/image";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Saves more time",
    text: "Save valuable hours each day, giving you more freedom to focus on the things that matter most to you",
    image: "/images/why-time.jpg",
    button: true,
  },
  {
    title: "More Options",
    text: "Order consumables from the best restaurants near you. From the variety of options proffered to you, select your best choice",
    image: "/images/why-options.jpg",
    button: true,
  },
  {
    title: "Personalized meal plan",
    text: "Create a customized meal plan tailored specifically to your needs using your unique nutrition data",
    image: "/images/why-meal.jpeg",
    button: false,
  },
  {
    title: "Customize your Order",
    text: "Save time creating meal plans and dietary boundaries for a perfect dining experience",
    image: "/images/why-custom.jpeg",
    button: false,
  },
];

export default function WhySection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
          Why Conzooming Stands Out
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                quality={90}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-200 mb-4">{feature.text}</p>

                {feature.button && (
                  <Button className="w-fit bg-secondary text-gray-900 hover:bg-secondary/90">
                    Start Ordering
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}