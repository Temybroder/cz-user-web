"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-700 font-medium">Terms of Service</span>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Conzooming&apos;s services, you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Services</h2>
              <p>
                Conzooming provides a food and grocery delivery platform connecting customers with restaurants, grocery stores,
                and pharmacies. We facilitate orders and deliveries but do not directly provide the products or delivery services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities under
                your account. Notify us immediately of any unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Orders and Payments</h2>
              <p>
                All orders are subject to availability and acceptance by vendors. Prices are subject to change.
                Payment must be made through our approved payment methods. You agree to pay all charges incurred.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cancellations and Refunds</h2>
              <p>
                Cancellation policies vary by vendor. Refunds are processed according to our refund policy.
                We reserve the right to refuse or cancel orders at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. User Conduct</h2>
              <p>
                You agree not to use our platform for unlawful purposes, to harass others, or to interfere with the platform&apos;s operation.
                We reserve the right to suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p>
                Conzooming is not liable for damages arising from use of our services, product quality issues,
                or delivery delays. Our liability is limited to the amount paid for the specific order in question.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h2>
              <p>
                For questions about these Terms of Service, contact us at{" "}
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
