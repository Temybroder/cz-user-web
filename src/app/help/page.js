

"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  CreditCard,
  Truck,
  Users,
  Shield,
  Star,
  Search,
} from "lucide-react"

const faqData = [
  {
    category: "Getting Started",
    icon: <Users className="w-5 h-5" />,
    questions: [
      {
        question: "How do I create an account on Conzooming?",
        answer:
          "Creating an account is simple! Click the 'Login' button on the homepage, then select 'Sign Up'. Enter your phone number, verify it with the OTP code we send you, and complete your profile. You'll be ready to start ordering fresh meals in minutes!",
      },
      {
        question: "What areas do you deliver to?",
        answer:
          "We currently deliver across Lagos State, including Victoria Island, Lekki, Ikeja, Surulere, and surrounding areas. We're constantly expanding our delivery zones. Enter your address during checkout to see if we deliver to your location.",
      },
      {
        question: "How do I place my first order?",
        answer:
          "After creating your account, browse our vendors and select your favorite meals. Add items to your cart, choose your delivery address, select a payment method, and place your order. You'll receive real-time updates on your order status.",
      },
    ],
  },
  {
    category: "Orders & Delivery",
    icon: <Truck className="w-5 h-5" />,
    questions: [
      {
        question: "How long does delivery take?",
        answer:
          "Standard delivery takes 30-60 minutes depending on your location and the vendor's preparation time. You can track your order in real-time through the app and receive notifications at each stage.",
      },
      {
        question: "Can I schedule orders for later?",
        answer:
          "Yes! You can schedule orders up to 7 days in advance. Simply select your preferred delivery time during checkout. This is perfect for planning meals ahead or ensuring your food arrives when you're available.",
      },
      {
        question: "What if my order is delayed or incorrect?",
        answer:
          "If there's any issue with your order, contact our support team immediately through the app or call our hotline. We'll work with the vendor to resolve the issue quickly and may offer compensation or a replacement meal.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "You can modify or cancel your order within 5 minutes of placing it, provided the vendor hasn't started preparation. After this window, please contact our support team who may still be able to help depending on the order status.",
      },
    ],
  },
  {
    category: "Payments & Wallet",
    icon: <CreditCard className="w-5 h-5" />,
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major debit and credit cards (Visa, Mastercard, Verve), bank transfers, and USSD payments. You can also fund your Conzooming wallet for faster checkout and exclusive wallet-only discounts.",
      },
      {
        question: "How does the wallet system work?",
        answer:
          "Your Conzooming wallet allows you to pre-fund your account for quick payments. Add money using any of our supported payment methods, and use your wallet balance for orders. Wallet users often get exclusive discounts and faster checkout.",
      },
      {
        question: "Are my payment details secure?",
        answer:
          "We use bank-level encryption and work with certified payment processors. Your card details are never stored on our servers, and all transactions are processed through secure, PCI-compliant channels.",
      },
      {
        question: "Can I get a refund?",
        answer:
          "Yes, refunds are processed for cancelled orders, undelivered items, or quality issues. Refunds typically take 3-5 business days to reflect in your original payment method, or can be instantly credited to your Conzooming wallet.",
      },
    ],
  },
  {
    category: "Meal Plans & Subscriptions",
    icon: <Star className="w-5 h-5" />,
    questions: [
      {
        question: "How do meal plans work?",
        answer:
          "Our meal plans are personalized weekly menus based on your dietary preferences, health goals, and taste preferences. You can customize your plan, skip weeks, or pause anytime. Meals are delivered according to your chosen schedule.",
      },
      {
        question: "Can I customize my meal plan?",
        answer:
          "Yes! You can swap meals, adjust portion sizes, exclude ingredients you don't like, and set dietary restrictions. Our system learns your preferences over time to suggest better meal combinations.",
      },
      {
        question: "How do subscriptions work?",
        answer:
          "Subscriptions provide regular meal deliveries at discounted rates. Choose your frequency (daily, weekly, etc.), select your preferred delivery days, and we'll handle the rest. You can cancel your subscription at the end of the delivery week.",
      },
      {
        question: "Can I pause or cancel my subscription?",
        answer:
          "Yes, you have full control over your subscription. Pause it when you're traveling, skip weeks when needed, or cancel anytime without penalties. Changes take effect from your next scheduled delivery.",
      },
    ],
  },
  {
    category: "Account & Profile",
    icon: <Shield className="w-5 h-5" />,
    questions: [
      {
        question: "How do I update my delivery address?",
        answer:
          "Go to your profile settings and select 'Addresses'. You can add multiple addresses, set a default one, and choose different addresses for different orders. Make sure to save your changes.",
      },
      {
        question: "How do I change my dietary preferences?",
        answer:
          "Visit your profile and go to 'Nutritional Preferences'. Update your dietary restrictions, allergies, health goals, and food preferences. This helps us recommend better meals and filter options that suit you.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account anytime by contacting our support team. Please note that this action is irreversible and will remove all your data, order history, and wallet balance.",
      },
      {
        question: "How do I refer friends?",
        answer:
          "Use our referral program to earn rewards! Go to 'Refer a Friend' in your profile, share your unique referral code, and earn ₦500 for each friend who signs up and makes their first order.",
      },
    ],
  },
]

const contactInfo = [
  {
    icon: <Phone className="w-5 h-5" />,
    title: "Phone Support",
    details: "+234 (0) 8083019993",
    description: "Available 24/7 for urgent issues",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "Email Support",
    details: "support@conzooming.com",
    description: "We respond within 1 hour",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "Live Chat",
    details: "Available in app",
    description: "Instant support during business hours",
  },
]

export default function HelpPage() {
  const router = useRouter()
  const [openItems, setOpenItems] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const sectionRefs = useRef({})

  const toggleItem = (category, index) => {
    const key = `${category}-${index}`
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const scrollToSection = (categoryName) => {
    const sectionId = categoryName.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")
    const element = document.getElementById(sectionId)

    if (element) {
      const headerOffset = 100 // Account for fixed header and some padding
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const handleCategoryClick = (categoryName) => {
    if (categoryName === "all") {
      setSelectedCategory("all")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      setSelectedCategory(categoryName.toLowerCase())
      scrollToSection(categoryName)
    }
  }

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter(
      (category) =>
        selectedCategory === "all" ||
        category.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        category.questions.length > 0,
    )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <button onClick={() => router.push("/")} className="hover:text-gray-700 transition-colors">
                  Home
                </button>
                <span>›</span>
                <span className="text-gray-900">Help Center</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">How can we help you?</h1>
              <p className="text-gray-600 mt-2">Find answers to common questions and get support</p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <HelpCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleCategoryClick("all")}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    selectedCategory === "all"
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  All Categories
                </button>
                {faqData.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(category.category)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center space-x-3 ${
                      selectedCategory === category.category.toLowerCase()
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {category.icon}
                    <span className="text-sm">{category.category}</span>
                  </button>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">Need More Help?</h4>
                <div className="space-y-4">
                  {contactInfo.map((contact, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {contact.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{contact.title}</div>
                        <div className="text-red-600 text-sm font-medium">{contact.details}</div>
                        <div className="text-gray-500 text-xs">{contact.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* FAQ Sections */}
            <div className="space-y-8">
              {filteredFAQ.map(
                (category, categoryIndex) =>
                  category.questions.length > 0 && (
                    <div
                      key={categoryIndex}
                      id={category.category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden scroll-mt-24"
                    >
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            {category.icon}
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                            {category.questions.length} questions
                          </span>
                        </div>
                      </div>

                      <div className="divide-y divide-gray-200">
                        {category.questions.map((item, index) => {
                          const key = `${category.category}-${index}`
                          const isOpen = openItems[key]

                          return (
                            <div key={index}>
                              <button
                                onClick={() => toggleItem(category.category, index)}
                                className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                              >
                                <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                                {isOpen ? (
                                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                )}
                              </button>
                              {isOpen && (
                                <div className="px-6 pb-5">
                                  <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ),
              )}
            </div>

            {/* No Results */}
            {filteredFAQ.every((category) => category.questions.length === 0) && (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any help articles matching your search. Try different keywords or browse our
                  categories.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Still Need Help */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white mt-12">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                <p className="text-red-100 mb-6">
                  Can&apos;t find what you&apos;re looking for? Our support team is here to help you 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-red-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    Start Live Chat
                  </button>
                  <a href="mailto:support@conzooming.com">
                    <button className="border border-white text-white px-6 py-3 rounded-xl font-medium hover:bg-white hover:text-red-600 transition-colors">
                        Send Email
                    </button>
                 </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
