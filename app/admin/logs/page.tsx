"use client";

import { useEffect, useState } from "react";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found — please login as admin first.");
      return;
    }

    fetch("http://localhost:8000/admin/logs", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Failed to fetch logs");
        }
        return res.json();
      })
      .then((data) => setLogs(data.logs || []))
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-red-50 dark:bg-red-950 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-red-600 dark:text-red-400 drop-shadow-md tracking-wide">
        ⚡ SYSTEM LOGS & ALERTS ⚡
      </h1>

      {error && (
        <div className="bg-red-600/80 dark:bg-red-700/80 border border-red-500 text-white p-4 rounded-lg mb-6 text-center font-medium">
          {error}
        </div>
      )}

      {logs.length === 0 && !error && (
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">No logs found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className="relative p-5 rounded-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-lg bg-white/30 dark:bg-gray-900/30 shadow-lg
                       transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-red-500/10 dark:bg-red-400/20 opacity-0 hover:opacity-30 transition-opacity duration-300 pointer-events-none" />

            <h2 className="font-bold text-lg text-red-600 dark:text-red-400 mb-2 capitalize">
              {log.action || "unknown"}
            </h2>

            <p className="text-gray-700 dark:text-gray-300 text-sm">
              <span className="font-semibold">Timestamp:</span>{" "}
              {log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
              <span className="font-semibold">Actor UID:</span> {log.actor_uid || "-"}
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
              <span className="font-semibold">Target Email:</span> {log.target_email || "-"}
            </p>

            <div className="mt-3 text-gray-800 dark:text-gray-200 text-sm border-t border-gray-300/30 dark:border-gray-600/50 pt-2">
              {log.details || "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
