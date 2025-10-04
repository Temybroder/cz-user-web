// Onboarding Section
export default function RidersOnbardingSection() {
    return (
      <section className="py-20 bg-white">
        <div className="container px-4 sm:px-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">
            Get started easily in 3 steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <OnboardingCard
              icon="📱"
              title="Sign Up"
              text="Register on our platform, and we'll verify your details to get you started"
            />
            <OnboardingCard
              icon="✅"
              title="Get verified"
              text="We take time to complete the necessary checks to verify your identity and confirm your right to work"
            />
            <OnboardingCard
              icon="🚴"
              title="Start delivering"
              text="After verification, you'll receive an email confirming your rider account is active and ready for orders"
            />
          </div>
        </div>
      </section>
    );
  }

  function OnboardingCard({ icon, title, text }) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-6xl mb-6">{icon}</div>
        <h4 className="text-xl font-bold mb-4 text-gray-900">{title}</h4>
        <p className="text-gray-600">{text}</p>
      </div>
    );
  }