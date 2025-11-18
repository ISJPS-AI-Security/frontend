"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";

export default function AdminChatsPage() {
  const { theme } = useTheme();
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedChat, setSelectedChat] = useState<any | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/admin/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setChats(data.chats);
      } catch (err: any) {
        setError("⚠️ Unable to fetch chats. Admin access required.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  const bg = theme === "light" ? "bg-red-50 text-gray-900" : "bg-red-950 text-gray-100";

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className={`min-h-screen p-8 ${bg}`}>
        <h1 className="text-4xl font-bold mb-8 text-center text-red-600 dark:text-red-400 drop-shadow-md tracking-wide">
          All User Chats (Admin View)
        </h1>

        {loading && <p className="text-lg animate-pulse text-center">Loading chats...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && chats.length === 0 && (
          <p className="opacity-70 text-center">No chats found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chats.map((chat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
              className="relative p-5 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg
                         transition-transform duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer"
              onClick={() => setSelectedChat(chat)}
            >
              {/* Hover Glow Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-red-500/10 dark:bg-red-400/20 opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none" />

              <div className="flex justify-between mb-2 text-sm opacity-80">
                <span>
                  <strong>{chat.email}</strong> ({chat.uid})
                </span>
                <span>{new Date(chat.timestamp).toLocaleString()}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-red-600 dark:text-red-400">Prompt:</span>{" "}
                <span>{chat.prompt}</span>
              </div>
              <div>
                <span className="font-semibold text-green-600 dark:text-green-400">Response:</span>{" "}
                <span className="opacity-90">{chat.response.length > 100 ? chat.response.slice(0, 100) + "..." : chat.response}</span>
              </div>
              <div className="mt-2 text-xs opacity-70">
                Label: {chat.label} | Confidence: {chat.confidence}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for Full Response */}
        <AnimatePresence>
          {selectedChat && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedChat(null)}
            >
              <motion.div
                className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-6 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-3 right-3 text-red-600 dark:text-red-400 font-bold text-lg"
                  onClick={() => setSelectedChat(null)}
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedChat.email} ({selectedChat.uid})
                </h2>
                <p className="mb-2"><span className="font-semibold text-red-600 dark:text-red-400">Prompt:</span> {selectedChat.prompt}</p>
                <p className="mb-2"><span className="font-semibold text-green-600 dark:text-green-400">Response:</span> {selectedChat.response}</p>
                <p className="mb-2 text-sm opacity-70">
                  Label: {selectedChat.label} | Confidence: {selectedChat.confidence}
                </p>
                <p className="text-xs opacity-60 mt-4">
                  Timestamp: {new Date(selectedChat.timestamp).toLocaleString()}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
