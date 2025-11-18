"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useTheme } from "@/app/context/ThemeContext";
import { motion } from "framer-motion";

export default function AdminMembersPage() {
  const { theme } = useTheme();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/admin/members", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setMembers(data.members);
        else setError(data.detail || "Failed to load members");
      } catch {
        setError("⚠️ Server not responding.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const bg = theme === "light" ? "bg-red-50 text-gray-900" : "bg-red-950 text-gray-100";

  // Sort and group by role
  const grouped = {
    admin: members.filter((m) => m.role === "admin"),
    manager: members.filter((m) => m.role === "manager"),
    user: members.filter((m) => m.role === "user"),
  };

  const sectionStyles =
    "flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-transparent";

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className={`min-h-screen p-8 ${bg}`}>
        <h1 className="text-4xl font-bold mb-8 text-center text-red-600 dark:text-red-400 drop-shadow-md tracking-wide">
          Members Overview (by Role)
        </h1>

        {loading && <p className="text-lg animate-pulse text-center">Loading members...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && members.length === 0 && (
          <p className="opacity-75 text-center">No members found.</p>
        )}

        {["admin", "manager", "user"].map((role) => {
          const roleMembers = grouped[role as keyof typeof grouped];
          if (!roleMembers.length) return null;

          const roleColor =
            role === "admin" ? "text-red-400" : role === "manager" ? "text-green-400" : "text-blue-400";

          const roleEmoji = role === "admin" ? "👑" : role === "manager" ? "🧭" : "👤";

          return (
            <section key={role} className={`mb-10 ${role !== "admin" ? "border-t border-gray-600 pt-6" : ""}`}>
              <h2 className={`text-2xl font-semibold mb-3 ${roleColor}`}>
                {roleEmoji} {role.charAt(0).toUpperCase() + role.slice(1)}s
              </h2>
              <div className={sectionStyles}>
                {roleMembers.map((m, idx) => (
                  <motion.div
                    key={m.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="min-w-[320px] relative bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-5
                               transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer"
                  >
                    {/* Hover Glow Overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-red-500/10 dark:bg-red-400/20 opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
                    <MemberCardContent member={m} />
                  </motion.div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </ProtectedRoute>
  );
}

// Extracted component for clarity
function MemberCardContent({ member }: { member: any }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">
        {member.display_name || "Unnamed"}
      </h2>
      <p className="text-sm opacity-80 mb-1"><b>Email:</b> {member.email}</p>
      <p className="text-sm opacity-80 mb-1"><b>Role:</b> {member.role}</p>
      <p className="text-sm opacity-80 mb-1"><b>Fault %:</b> {member.fault_percent}%</p>
      <p className="text-sm opacity-80 mb-1">
        <b>Status:</b> {member.blocked ? "❌ Blocked" : "✅ Active"}
      </p>

      <h3 className="text-md font-semibold mt-3 mb-2 border-t border-gray-400 pt-2">
        Recent Chats
      </h3>
      <div className="max-h-40 overflow-y-auto text-sm space-y-2 scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-transparent">
        {member.recent_chats && member.recent_chats.length > 0 ? (
          member.recent_chats.map((c: any, i: number) => (
            <div
              key={i}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <p><b>Prompt:</b> {c.original}</p>
              <p className="opacity-80">
                <b>Label:</b> {c.label} |{" "}
                <b>Time:</b> {new Date(c.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="opacity-70 italic">No chat history</p>
        )}
      </div>
    </div>
  );
}
