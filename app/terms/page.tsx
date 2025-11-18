"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function TermsPage() {
  const { theme } = useTheme();
  const bg = theme === "light" ? "bg-blue-50" : "bg-blue-950";
  const textColor = theme === "light" ? "text-gray-900" : "text-gray-100";

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className={`relative min-h-screen p-6 md:p-10 flex flex-col ${bg}`}>
        
        {/* Animated Blue Blobs Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute w-80 h-80 bg-blue-400/20 rounded-full blur-3xl top-10 left-10"
          />
          <motion.div
            animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-20 right-10"
          />
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative z-10 max-w-3xl mx-auto backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 rounded-2xl p-8 md:p-12 shadow-lg`}
        >
          <h1 className="text-4xl font-bold mb-6 text-blue-600">Terms & Conditions</h1>
          
          <p className={`mb-6 ${textColor}`}>
            Welcome to ISJPS AI Chat! Our AI is here to help you learn, explore, and create — let’s keep it safe and productive for everyone.
          </p>

          <h2 className="text-2xl font-semibold mb-3 text-blue-500">What’s Allowed:</h2>
          <ul className={`list-disc ml-6 mb-6 space-y-2 ${textColor}`}>
            <li>Use the AI for learning, research, and creative projects.</li>
            <li>Treat the platform responsibly and ethically.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-blue-500">What’s Not Allowed:</h2>
          <ul className={`list-disc ml-6 mb-6 space-y-2 ${textColor}`}>
            <li>Generating, sharing, or requesting harmful, illegal, or offensive content.</li>
            <li>Attempting to exploit, manipulate, or damage the AI system.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-3 text-blue-500">What Happens If You Break the Rules:</h2>
          <ul className={`list-disc ml-6 mb-6 space-y-2 ${textColor}`}>
            <li>Accounts may be temporarily suspended or permanently deleted.</li>
            <li>Repeat or serious violations may result in loss of access without warning.</li>
          </ul>

          <p className={`mt-6 ${textColor}`}>
            Thank you for helping us create a safe, smart, and inspiring space for everyone!
          </p>
        </motion.div>

        {/* Footer */}
        <footer className={`mt-auto py-4 text-center text-xs ${theme === "light" ? "text-gray-600" : "text-white/70"} relative z-10`}>
          &copy; {new Date().getFullYear()} ISJPS Portal — All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
