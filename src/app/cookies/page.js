"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-700 font-medium">Cookie Policy</span>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. What Are Cookies</h2>
              <p>
                Cookies are small text files stored on your device when you visit our website.
                They help us provide a better user experience and understand how you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Types of Cookies We Use</h2>
              <div className="space-y-3">
                <p>
                  <strong>Essential Cookies:</strong> Required for the website to function properly,
                  including authentication and security features.
                </p>
                <p>
                  <strong>Performance Cookies:</strong> Help us understand how visitors interact with our website
                  by collecting anonymous information.
                </p>
                <p>
                  <strong>Functionality Cookies:</strong> Remember your preferences and personalize your experience.
                </p>
                <p>
                  <strong>Marketing Cookies:</strong> Track your visit across websites to display relevant advertisements.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Cookies</h2>
              <p>
                We use cookies to maintain your session, remember your cart items, personalize content,
                analyze site traffic, and improve our services. Cookies also help us detect and prevent fraud.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Third-Party Cookies</h2>
              <p>
                We use third-party services like payment processors and analytics providers that may set their own cookies.
                These cookies are governed by the respective third party&apos;s privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Managing Cookies</h2>
              <p>
                You can control and delete cookies through your browser settings. Note that disabling cookies
                may affect the functionality of our website. Most browsers allow you to refuse cookies or delete existing cookies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy to reflect changes in technology or legal requirements.
                Please review this page periodically for updates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us at{" "}
                <a href="mailto:support@conzooming.com" className="text-red-500 hover:text-red-600">
                  support@conzooming.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/" className="inline-flex items-center text-red-500 hover:text-red-600 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
