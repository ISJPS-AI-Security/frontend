"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useTheme } from "@/app/context/ThemeContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { theme, setDisplayName } = useTheme();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Load user info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setStatus("⚠️ Not logged in.");
      try {
        const res = await fetch("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.display_name) {
          setName(data.display_name);
        } else {
          setStatus("⚠️ Failed to load profile.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setStatus("⚠️ Server not responding.");
      }
    };
    fetchUser();
  }, []);

  // Save name
  const handleSave = async () => {
    if (!name.trim()) {
      setStatus("❌ Name cannot be empty.");
      return;
    }

    setSaving(true);
    setStatus("Saving...");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:8000/update_name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (data.ok) {
        setStatus("✅ Name updated successfully!");
        setDisplayName(name);
        setTimeout(() => router.push("/user"), 1200);
      } else {
        setStatus("❌ Failed to update name. Try again.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setStatus("⚠️ Server not responding.");
    } finally {
      setSaving(false);
    }
  };

  // Theme-based background
  const pageBg =
    theme === "light"
      ? "bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 text-gray-900"
      : "bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-gray-100";

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className={`min-h-screen flex flex-col justify-center items-center px-4 md:px-0 ${pageBg}`}>
        
        {/* Floating Glass Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/20 dark:bg-gray-900/30 backdrop-blur-2xl border border-white/20 dark:border-gray-700/40 rounded-3xl shadow-2xl p-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
            Settings
          </h1>

          <label className="block text-left text-sm font-semibold mb-2">
            Display Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your display name"
            className="w-full p-3 border rounded-xl mb-4 bg-white/30 dark:bg-gray-800/50 border-gray-300/50 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 dark:focus:ring-blue-600 placeholder-gray-500 text-gray-900 dark:text-white transition"
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          {status && (
            <p className="mt-4 text-sm opacity-90 transition-all duration-300">
              {status}
            </p>
          )}
        </motion.div>

        {/* Footer */}
        <footer className={`mt-10 py-4 text-center text-xs ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
          &copy; {new Date().getFullYear()} ISJPS Portal — All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
