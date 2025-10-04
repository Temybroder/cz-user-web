import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronDown, ArrowRight } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "How is Conzooming different from other delivery apps and services?",
      answer:
        "Conzooming addresses the pain-points of letting our Conzoomers (customers) have the power to decide how their food is prepared. We also don't just claim speedy delivery, we deliver ultra-fast, and at the best rates.",
    },
    {
      question: "How does Conzooming personalise my meals?",
      answer:
        "We use your nutritional health profile where you can specify things like allergies and preferences, to curate meal options.",
    },
    {
      question: "How does Conzooming subscription work?",
      answer:
        "Our subscription allows you to plan for your food needs ahead of time on a weekly basis. You can choose your meals or allow our system to recommend the best meals.",
    },
    {
      question: "How are delivery fees calculated?",
      answer:
        "Delivery fees are based on distance, order size, and real-time delivery conditions.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-yellow-50/30 to-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="relative aspect-[1.1] w-full max-w-md mx-auto rounded-3xl overflow-hidden group shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/40 to-red-100/30 z-10" />
            <Image
              src="/images/faq-imager.png"
              alt="FAQ"
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
              quality={90}
            />
            <div className="absolute bottom-6 left-6 z-20">
              <span className="bg-turquoise-200 text-black px-4 py-1.5 rounded-full text-xs font-bold shadow">
                FAQS
              </span>
              <h3 className="text-white text-2xl mt-3 font-bold drop-shadow-xl leading-snug">
                Common Questions
                <br />
                <span className="text-turquoise-100">Answered</span>
              </h3>
            </div>
          </div>

          {/* Accordion Section */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-400 via-yellow-500 to-turquoise-400 bg-clip-text text-transparent">
              Need Help? We have answers
            </h2>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-2xl bg-white hover:bg-yellow-50/30 transition-all shadow-sm"
                >
                  <AccordionTrigger className="flex items-center justify-between w-full p-6 hover:no-underline group">
                    <span className="text-left text-lg font-semibold text-black group-hover:text-primary">
                      {faq.question}
                    </span>
                    <ChevronDown className="h-5 w-5 ml-4 text-yellow-600 group-hover:rotate-180 transition-transform duration-300" />
                  </AccordionTrigger>

                  <AccordionContent className="px-6 pb-6 text-gray-800 font-medium">
                    <div className="border-t border-yellow-100 pt-4">
                      {faq.answer}
                    </div>
                    <Button
                      variant="link"
                      className="text-turquoise-600 hover:text-turquoise-800 mt-4 pl-0 font-semibold"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
