"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";

export default function AdminManagePage() {
  const { theme } = useTheme();
  const [data, setData] = useState<{ users: any[]; blacklist: any[] }>({ users: [], blacklist: [] });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchOverview = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/manage_overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await res.json();
      setData(d);
    } catch {
      setMsg("⚠️ Unable to load management data.");
    } finally {
      setLoading(false);
    }
  };

  const performAction = async (endpoint: string, payload: any) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      setMsg(d.message || "✅ Action completed");
      fetchOverview();
    } catch {
      setMsg("⚠️ Server not responding.");
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const bg = theme === "light" ? "bg-red-50 text-gray-900" : "bg-red-950 text-gray-100";

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className={`min-h-screen p-8 ${bg}`}>
        <h1 className="text-3xl font-bold text-red-600 mb-8">Admin Management Panel</h1>

        {msg && <p className="mb-6 text-sm">{msg}</p>}

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            {/* USERS CARDS */}
            <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {data.users.map((u, i) => (
                <motion.div
                  key={u.uid || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative p-5 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-white/30 dark:bg-gray-900/30 shadow-lg hover:shadow-[0_0_25px_rgba(255,0,0,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer`}
                >
                  <div className="mb-2 text-gray-800 dark:text-gray-100 font-semibold">{u.email}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">UID: {u.uid}</div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="capitalize">{u.role}</span>
                    <span>Fault: {u.fault_percent || 0}%</span>
                    <span>{u.blocked ? "✅" : "❌"}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {!u.blocked && (
                      <button
                        onClick={() => performAction("/admin/block_user", { uid: u.uid })}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Block
                      </button>
                    )}
                    {u.blocked && (
                      <button
                        onClick={() => performAction("/admin/unblock_user", { uid: u.uid })}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        Unblock
                      </button>
                    )}
                    <button
                      onClick={() => performAction("/admin/delete_user", { uid: u.uid })}
                      className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* BLACKLIST CARDS */}
            <h2 className="text-xl font-semibold mb-4">Blacklist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {data.blacklist.map((b, i) => (
                <motion.div
                  key={b.email || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative p-5 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-white/30 dark:bg-gray-900/30 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{b.email}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Added by: {b.added_by}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-200 mb-3">
                    {new Date(b.timestamp).toLocaleString()}
                  </div>
                  <button
                    onClick={() => performAction("/admin/blacklist_remove", { email: b.email })}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>

            {/* ADD TO BLACKLIST */}
            <div className="flex gap-2 flex-wrap">
              <input
                type="email"
                id="newEmail"
                placeholder="Enter email to blacklist"
                className="p-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 flex-1"
              />
              <button
                onClick={() => {
                  const email = (document.getElementById("newEmail") as HTMLInputElement).value;
                  if (email) performAction("/admin/blacklist_add", { email });
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Add
              </button>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
