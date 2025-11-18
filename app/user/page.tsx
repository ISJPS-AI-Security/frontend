"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import { motion } from "framer-motion";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";
import { FiMessageCircle, FiClock, FiFileText, FiSettings } from "react-icons/fi";

export default function UserDashboard() {
  const { setRole, theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<{ display_name?: string; email?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRole("user");
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not logged in");
          return;
        }
        const res = await fetch("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("⚠️ Server not responding.");
      }
    };
    fetchUser();
  }, []);

  const cards = [
    { title: "Chat with AI", link: "/chat", icon: <FiMessageCircle size={28} /> },
    { title: "View Chat History", link: "/history", icon: <FiClock size={28} /> },
    { title: "Terms & Conditions", link: "/terms", icon: <FiFileText size={28} /> },
    { title: "Settings", link: "/user/settings", icon: <FiSettings size={28} /> },
  ];

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className={`relative min-h-screen transition-colors duration-500 flex flex-col ${theme === "light" ? "bg-blue-50" : "bg-blue-950"}`}>
        
        {/* Animated Blue Blobs Background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute w-80 h-80 bg-blue-400/30 rounded-full blur-3xl top-10 left-10"
          />
          <motion.div
            animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute w-96 h-96 bg-blue-300/30 rounded-full blur-3xl bottom-20 right-10"
          />
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        {/* Header */}
        <header className={`flex justify-between items-center p-4 md:p-6 backdrop-blur-md bg-white/20 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-700`}>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">ISJPS</div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="font-semibold text-gray-800 dark:text-gray-200">
              {user ? user.display_name || "User" : error || "Loading..."}
            </div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-white/30 dark:bg-gray-800/40 text-blue-600 dark:text-blue-400 font-semibold transition duration-300 hover:bg-white/50 dark:hover:bg-gray-800/60"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <LogoutButton />
          </div>
        </header>

        {/* Welcome Section */}
        <section className="p-6 md:p-10 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            Welcome {user ? user.display_name || "User" : "User"}
          </h1>
          <p className="text-sm md:text-base opacity-80 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            You're now experiencing secured AI. Please read Terms and Conditions to continue.
          </p>
        </section>

        {/* Cards Section */}
        <main className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 p-6 md:p-10 justify-items-center flex-1 relative z-10">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="w-full max-w-xs"
            >
              <Link href={card.link}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`backdrop-blur-xl rounded-2xl p-6 md:p-8 cursor-pointer flex flex-col items-center gap-4 text-center shadow-lg transition-all duration-300
                    ${theme === "light"
                      ? "bg-blue-100/30 text-gray-900 hover:bg-blue-300 hover:text-blue-900"
                      : "bg-gray-800/30 text-gray-100 hover:bg-blue-900 hover:text-white"
                    }
                  `}
                >
                  <div className={`text-blue-600 dark:text-blue-400`}>{card.icon}</div>
                  <h2 className="text-xl font-semibold">{card.title}</h2>
                  <p className="text-sm opacity-80">
                    Access {card.title.toLowerCase()} section
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </main>

{/* Footer */}
<footer className={`mt-auto py-4 text-center text-xs ${theme === "light" ? "text-gray-600" : "text-white/70"} relative z-10`}>
  &copy; {new Date().getFullYear()} ISJPS Portal — All rights reserved.
</footer>

      </div>
    </ProtectedRoute>
  );
}
