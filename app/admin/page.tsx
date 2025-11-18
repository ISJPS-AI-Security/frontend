"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import { motion } from "framer-motion";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";
import { FiFileText, FiUsers, FiMessageCircle, FiAlertOctagon, FiSettings } from "react-icons/fi";

export default function AdminDashboard() {
  const { setRole, theme, toggleTheme } = useTheme();
  const [displayName, setDisplayName] = useState("Admin");

  useEffect(() => {
    setRole("admin");
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://127.0.0.1:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setDisplayName(data.display_name || "Admin");
        }
      } catch (err) {
        console.error("Error fetching admin info:", err);
      }
    };
    fetchAdmin();
  }, [setRole]);

  const cards = [
    { title: "View Logs", link: "/admin/logs", icon: <FiFileText size={28} /> },
    { title: "View Users & Managers", link: "/admin/members", icon: <FiUsers size={28} /> },
    { title: "View User Chat", link: "/admin/chats", icon: <FiMessageCircle size={28} /> },
    { title: "Manage System", link: "/admin/manage", icon: <FiAlertOctagon size={28} /> },
    { title: "Settings", link: "/admin/settings", icon: <FiSettings size={28} /> },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className={`relative min-h-screen flex flex-col transition-colors duration-500 ${theme === "light" ? "bg-red-50" : "bg-red-950"}`}>
        
        {/* Animated Red Blobs Background */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
            className="absolute w-80 h-80 bg-red-400/30 rounded-full blur-3xl top-10 left-10"
          />
          <motion.div
            animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute w-96 h-96 bg-red-300/30 rounded-full blur-3xl bottom-20 right-10"
          />
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            className="absolute w-72 h-72 bg-red-500/20 rounded-full blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        {/* Header */}
        <header className={`flex justify-between items-center p-4 md:p-6 backdrop-blur-md bg-white/20 dark:bg-red-900/30 border-b border-white/20 dark:border-red-700`}>
          <div className={`text-2xl font-bold ${theme === "light" ? "text-red-600" : "text-red-400"}`}>ISJPS</div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="font-semibold text-gray-800 dark:text-gray-200">{displayName}</div>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-white/30 dark:bg-red-800/40 text-red-600 dark:text-red-400 font-semibold transition duration-300 hover:bg-white/50 dark:hover:bg-red-800/60"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <LogoutButton />
          </div>
        </header>

        {/* Welcome Section */}
        <section className="p-6 md:p-10 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">Welcome {displayName}</h1>
          <p className="text-sm md:text-base opacity-80 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            You are now monitoring and managing the full ISJPS system. Use the cards below to navigate.
          </p>
        </section>

        {/* Cards Section */}
        <main className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 p-6 md:p-10 justify-items-center flex-1 relative z-10">
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
                      ? "bg-red-100/30 text-gray-900 hover:bg-red-300 hover:text-red-900"
                      : "bg-red-800/30 text-gray-100 hover:bg-red-700 hover:text-white"
                    }
                  `}
                >
                  <div className={`text-red-600 dark:text-red-400`}>{card.icon}</div>
                  <h2 className="text-xl font-semibold">{card.title}</h2>
                  <p className="text-sm opacity-80">Manage {card.title.toLowerCase()}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </main>

        {/* Footer */}
        <footer className={`mt-auto py-4 text-center text-xs relative z-10 ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
          &copy; {new Date().getFullYear()} ISJPS Portal — All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
