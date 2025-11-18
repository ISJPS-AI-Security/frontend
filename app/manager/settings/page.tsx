"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useTheme } from "@/app/context/ThemeContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ManagerSettingsPage() {
  const { theme, setDisplayName } = useTheme();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setName(data.display_name || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://127.0.0.1:8000/update_name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Name updated successfully!");
        setDisplayName(name);
        setTimeout(() => router.push("/admin"), 1500); // redirect to admin dashboard
      } else {
        setStatus("❌ Failed to update name.");
      }
    } catch {
      setStatus("⚠️ Server not responding.");
    } finally {
      setSaving(false);
    }
  };

  const bg =
    theme === "light"
      ? "bg-gray-50 text-gray-900"
      : "bg-gray-950 text-gray-100";

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className={`min-h-screen flex flex-col items-center justify-center ${bg}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 p-8 rounded-2xl shadow-lg w-96 text-center"
        >
          <h1 className="text-2xl font-bold mb-4 text-green-600">Manager Settings</h1>
          <label className="block text-left text-sm font-semibold mb-2">
            Display Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4 bg-transparent border-gray-300 dark:border-gray-600 focus:ring focus:ring-green-400"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {status && (
            <p className="mt-3 text-sm opacity-80 transition-all duration-300">
              {status}
            </p>
          )}
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
