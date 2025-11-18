"use client";

import { useEffect, useState } from "react";
import { getToken } from "../../../utils/firebaseAuth";
import { motion } from "framer-motion";

interface Prompt {
  prompt: string;
  response: string;
  status: "safe" | "sanitized" | "dangerous" | "malicious";
  timestamp: number;
}

interface User {
  _id: string;
  uid: string;
  name?: string;
  email?: string;
  fault_stats: {
    total: number;
    safe: number;
    sanitized: number;
    dangerous: number;
    malicious: number;
  };
}

const ManagerFaultsPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [faults, setFaults] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error("You must be logged in");

      const res = await fetch("http://localhost:8000/manager/faults", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFaults = async (uid: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("You must be logged in");

      const res = await fetch(`http://localhost:8000/manager/faults/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user faults");

      const data = await res.json();
      setSelectedUser({ ...selectedUser, name: data.user });
      setFaults(data.fault_prompts);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getDominantColor = (stats: User["fault_stats"]) => {
    const { safe, sanitized, dangerous, malicious } = stats;
    const max = Math.max(safe, sanitized, dangerous, malicious);
    if (max === safe) return "border-green-500 shadow-green-200";
    if (max === sanitized) return "border-yellow-400 shadow-yellow-200";
    if (max === dangerous) return "border-orange-400 shadow-orange-200";
    if (max === malicious) return "border-red-500 shadow-red-200";
    return "border-gray-300 shadow-gray-100";
  };

  const getBarColor = (type: string) => {
    switch (type) {
      case "safe":
        return "bg-green-500";
      case "sanitized":
        return "bg-yellow-400";
      case "dangerous":
        return "bg-orange-500";
      case "malicious":
        return "bg-red-600";
      default:
        return "bg-gray-300";
    }
  };

  if (loading)
    return (
      <p className="text-center mt-20 text-green-600 text-lg animate-pulse">
        Loading users...
      </p>
    );
  if (error)
    return (
      <p className="text-center mt-20 text-red-500 text-lg font-semibold">
        {error}
      </p>
    );

  return (
    <div className="p-8 md:p-12 bg-green-50 dark:bg-green-950 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white">
        User Fault Analysis
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto">
        {/* User Cards */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          {users.map((user, idx) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white/60 dark:bg-green-900/40 backdrop-blur-xl p-6 rounded-2xl border-l-4 ${getDominantColor(
                user.fault_stats
              )} shadow-md hover:shadow-2xl hover:scale-105 cursor-pointer transition-all`}
              onClick={() => fetchUserFaults(user.uid)}
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                {user.name || user.email}
              </h2>
              <div className="mt-4 space-y-2">
                {["safe", "sanitized", "dangerous", "malicious"].map((type) => {
                  const value = user.fault_stats[type as keyof typeof user.fault_stats];
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <span className="w-24 text-sm capitalize">{type}:</span>
                      <div className="flex-1 h-3 bg-gray-200 rounded">
                        <div
                          className={`${getBarColor(type)} h-3 rounded`}
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                      <span className="w-10 text-sm text-gray-700 dark:text-gray-200">{value}%</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fault History Panel */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          {selectedUser ? (
            <>
              <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 text-center">
                Fault Prompts: {selectedUser.name}
              </h2>
              <div className="flex flex-col gap-4 max-h-[700px] overflow-y-auto">
                {faults.map((f, idx) => (
                  <motion.div
                    key={`${f.prompt}-${f.timestamp}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`p-4 rounded-xl shadow-md border-l-4 ${
                      f.status === "safe"
                        ? "bg-green-50 border-green-500"
                        : f.status === "sanitized"
                        ? "bg-yellow-50 border-yellow-400"
                        : f.status === "dangerous"
                        ? "bg-orange-50 border-orange-400"
                        : "bg-red-50 border-red-500"
                    }`}
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      Prompt: {f.prompt}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mt-1">
                      AI Response: {f.response}
                    </p>
                    <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                      Status: {f.status}
                    </p>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-700 dark:text-gray-300 mt-20">
              Select a user to view fault prompts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerFaultsPage;
