"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/utils/firebaseAuth";
import { useTheme } from "@/app/context/ThemeContext";

interface User {
  uid: string;
  email: string;
  blocked: boolean;
}

export default function ManagerBlockPage() {
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) throw new Error("You must be logged in");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manager/users_to_block`, {
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

  const toggleBlock = async (uid: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error("You must be logged in");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manager/block_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ uid }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to block/unblock user");
      }

      const data = await res.json();

      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, blocked: data.blocked } : u))
      );
    } catch (err: any) {
      alert(err.message || "Failed to block/unblock user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading users...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div
      className={`min-h-screen p-6 md:p-10 ${
        theme === "light" ? "bg-green-50 text-gray-900" : "bg-green-950 text-white"
      } transition-colors duration-300`}
    >
      <h1 className="text-3xl font-bold mb-6">Manage Users (Block/Unblock)</h1>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.uid}
            className={`flex justify-between items-center p-4 rounded-xl shadow-lg transition-all duration-200 ${
              user.blocked
                ? "bg-red-500 text-white dark:bg-red-700"
                : "bg-white/90 text-gray-800 dark:bg-gray-800/90 dark:text-gray-200"
            }`}
          >
            <p className="font-mono">{user.email}</p>

            <button
              onClick={() => toggleBlock(user.uid)}
              className={`px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                user.blocked
                  ? "bg-white text-red-600 hover:bg-gray-100 dark:text-red-300"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {user.blocked ? "Unblock" : "Block"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
