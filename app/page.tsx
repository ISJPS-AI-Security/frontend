"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  const steps = [
    { title: "Real-time Analysis", description: "Every prompt is analyzed for security threats before AI processing.", icon: "🛡️" },
    { title: "Set Up Profile", description: "Add your details and preferences for a personalized experience with Multi-Level Access.", icon: "👤" },
    { title: "Advance Protection", description: "Secure your business from AI threats while maintaining control.", icon: "🔐" },
  ];

  const features = [
    { title: "100% Secure", description: "24/7 AI Monitoring", icon: "👁️‍🗨️" },
    { title: "Real-Time Alerts", description: "Never Leave Things Unsecured", icon: "⚡" },
    { title: "Protection", description: "Always with You", icon: "🛡️" },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center px-6 md:px-16 pt-16
                     bg-gradient-to-br from-blue-50 via-green-50 to-red-50">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-2">
          ISJPS
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
          Intelligent Safeguard for Jailbreak Detection and Prompt Security
        </p>
      </motion.div>

      {/* Steps Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl mb-16"
      >
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-white/30 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <div className="text-6xl mb-6">{step.icon}</div>
            <h3 className="text-2xl font-semibold mb-2 text-blue-600 dark:text-blue-400">{step.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action Buttons */}
      <div className="flex flex-col md:flex-row gap-6 mb-16">
        <Link
          href="/login"
          className="px-10 py-4 bg-blue-600 text-white rounded-full flex items-center gap-3 justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        >
          ✅ Sign In
        </Link>
        <Link
          href="/register"
          className="px-10 py-4 border border-blue-600 text-blue-600 rounded-full flex items-center gap-3 justify-center hover:bg-blue-50 transition-all duration-300"
        >
          🚀 Get Started
        </Link>
      </div>

      {/* Bottom Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl mb-16"
      >
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-white/30 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <div className="text-6xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{feature.title}</h3>
            {feature.description && (
              <p className="text-gray-700 dark:text-gray-300 mt-2">{feature.description}</p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <footer className="mt-10 py-4 text-center text-xs text-gray-600 dark:text-white/70">
        &copy; {new Date().getFullYear()} ISJPS Portal — All rights reserved.
      </footer>
    </main>
  );
}
