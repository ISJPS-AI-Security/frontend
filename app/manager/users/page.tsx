"use client";

import { useEffect, useState } from "react";
import { getToken } from "../../../utils/firebaseAuth";
import { motion } from "framer-motion";

interface User {
  _id: string;
  uid: string;
  name?: string;
  email?: string;
  role: string;
  daily_quota_left?: number;
  fault_percent?: number;
  blocked?: boolean;
  flagged?: boolean;
  deleted?: boolean;
  [key: string]: any;
}

const ManagerUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) throw new Error("You must be logged in to view users");

      const res = await fetch("http://localhost:8000/manager/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401)
          throw new Error("Unauthorized: Invalid token or not a manager");
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
    <div className="p-6 md:p-10 min-h-screen bg-green-50 dark:bg-green-950 transition-colors duration-300">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white text-center">
        Users Management
      </h1>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, idx) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white/50 dark:bg-green-900/40 backdrop-blur-xl shadow-lg rounded-2xl p-6 hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.name || "Unknown"}
              </h2>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold
                ${user.role === "admin" ? "bg-red-500 text-white" :
                  user.role === "manager" ? "bg-green-600 text-white" :
                  "bg-blue-500 text-white"}`}>
                {user.role}
              </span>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-semibold">UID:</span> {user.uid}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-semibold">Email:</span> {user.email || "-"}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-semibold">Daily Quota Left:</span> {user.daily_quota_left ?? "-"}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              <span className="font-semibold">Fault %:</span> {user.fault_percent ?? "-"}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                user.blocked ? "bg-red-600 text-white" : "bg-green-600 text-white"
              }`}>{user.blocked ? "Blocked" : "Active"}</span>

              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                user.flagged ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white"
              }`}>{user.flagged ? "Flagged" : "Normal"}</span>

              {user.deleted && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-500 text-white">
                  Deleted
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManagerUsersPage;
