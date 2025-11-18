"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { FiClock, FiMessageCircle } from "react-icons/fi";

export default function UserHistoryPage() {
  const { theme } = useTheme();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/user/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className={`relative min-h-screen p-6 md:p-10 flex flex-col ${theme === "light" ? "bg-blue-50" : "bg-blue-950"}`}>
        
        {/* Animated Blue Blobs Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute w-80 h-80 bg-blue-400/20 rounded-full blur-3xl top-10 left-10"
          />
          <motion.div
            animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
            transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
            className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-20 right-10"
          />
        </div>

        <h1 className={`text-3xl md:text-4xl font-bold mb-8 text-blue-600 relative z-10`}>
          Your Chat History
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 relative z-10">Loading...</div>
        ) : logs.length === 0 ? (
          <p className="text-center opacity-70 relative z-10">No chat history yet.</p>
        ) : (
          <div className="space-y-6 relative z-10">
            {logs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-xl cursor-pointer transform transition-all duration-300
                  ${theme === "light"
                    ? "bg-gradient-to-r from-blue-100/60 to-blue-200/60 hover:from-blue-200/80 hover:to-blue-300/80"
                    : "bg-gray-800/50 hover:bg-blue-900/40"
                  }
                `}
              >
                <div className={`flex items-center gap-2 text-sm mb-3 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  <FiClock size={16} />
                  {new Date(log.timestamp).toLocaleString()}
                </div>

                <div className="flex items-start gap-3">
                  <FiMessageCircle size={22} className={theme === "light" ? "text-blue-600" : "text-blue-400"} />
                  <div className="flex-1">
                    <div className={`font-semibold mb-1 ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>Prompt:</div>
                    <div className={`${theme === "light" ? "text-gray-800" : "text-gray-200"}`}>{log.original}</div>
                  </div>
                </div>

                {log.generation_preview && (
                  <div className={`mt-4 p-4 rounded-2xl ${theme === "light" ? "bg-blue-50 text-blue-900" : "bg-blue-900/50 text-blue-200"} shadow-inner`}>
                    <strong>AI Response:</strong> {log.generation_preview.slice(0, 150)}...
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className={`mt-auto py-4 text-center text-xs ${theme === "light" ? "text-gray-600" : "text-white/70"} relative z-10`}>
          &copy; {new Date().getFullYear()} ISJPS Portal — All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
