"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/utils/firebaseAuth";
import { useTheme } from "@/app/context/ThemeContext";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface ChatRecord {
  _id: string;
  uid: string;
  prompt: string;
  status: "sanitized" | "dangerous" | "malicious"; // safe is not included
  createdAt: number;
}

interface UserGroupedChats {
  uid: string;
  name?: string;
  email?: string;
  chats: ChatRecord[];
}

export default function ManagerHistoryPage() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userChats, setUserChats] = useState<UserGroupedChats[]>([]);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error("You must be logged in");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manager/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch chat history");
      const data = await res.json();

      // Map backend users object to array of UserGroupedChats
      const grouped: UserGroupedChats[] = Object.entries(data.users).map(
        ([uid, user]: [string, any]) => ({
          uid,
          name: user.name || "-",
          email: user.email || "-",
          chats: user.fault_prompts.map((p: any) => ({
            _id: p._id,
            uid: p.uid,
            prompt: p.original,
            status: p.label, // sanitized / dangerous / malicious
            createdAt: p.timestamp,
          })),
        })
      );

      setUserChats(grouped);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const toggleUser = (uid: string) => {
    setExpandedUser(expandedUser === uid ? null : uid);
  };

  if (loading) return <p className="text-center mt-10">Loading chat history...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div
      className={`min-h-screen p-6 md:p-10 ${
        theme === "light" ? "bg-green-50 text-gray-900" : "bg-green-950 text-white"
      } transition-colors duration-300`}
    >
      <h1 className="text-3xl font-bold mb-6">Users Chat History (Fault Prompts Only)</h1>

      <div className="space-y-4">
        {userChats.map((user) => (
          <div key={user.uid} className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => toggleUser(user.uid)}
              className="w-full flex justify-between items-center p-4 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900 transition"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  {user.name} ({user.email})
                </h2>
                <p className="text-sm opacity-75">{user.chats.length} fault prompts</p>
              </div>
              <div className="text-green-600 dark:text-green-400">
                {expandedUser === user.uid ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
              </div>
            </button>

            <AnimatePresence>
              {expandedUser === user.uid && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-gray-300 dark:border-gray-700"
                >
                  <div className="p-4 space-y-3">
                    {user.chats.map((chat) => (
                      <div
                        key={chat._id}
                        className="p-3 rounded-xl shadow-sm bg-gray-100 dark:bg-gray-900 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold">{chat.status.toUpperCase()}</span>
                          <span className="text-xs opacity-70">
                            {new Date(chat.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap break-words">{chat.prompt}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
