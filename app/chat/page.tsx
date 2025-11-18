"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/ToastProvider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPage() {
  const { theme, role } = useTheme();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ prompt: input, confirm: true }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = err.detail || res.statusText || "Unknown error";
        throw new Error(msg);
      }

      const data = await res.json();
      let aiResponse =
        typeof data.generation === "string"
          ? data.generation
          : data.generation && typeof data.generation.text === "string"
          ? data.generation.text
          : JSON.stringify(data);

      if (!aiResponse) aiResponse = "⚠️ No valid AI response.";

      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse.trim() }]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      toast({
        title: "Chat Error",
        description: err.message || "AI backend not responding. Try again later.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error: could not reach AI backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Theme-based colors
  const userBubble = theme === "light" ? "bg-blue-200/80 text-blue-900" : "bg-blue-800/80 text-white";
  const aiBubble = theme === "light" ? "bg-white/50 text-gray-900" : "bg-gray-900/60 text-gray-100";
  const placeholderText = theme === "light" ? "text-gray-700" : "text-gray-400";

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-gradient-to-b ${theme === "light" ? "from-blue-50 via-blue-100 to-blue-200" : "from-blue-950 via-blue-900 to-blue-950"} relative`}>

      {/* Main Content */}
      <div className="flex justify-center items-start pt-16 px-4 md:px-0">
        {/* Floating Glass Chat Panel */}
        <div className="w-full max-w-3xl h-[80vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden
                        bg-white/20 dark:bg-gray-900/30 backdrop-blur-2xl border border-white/20 dark:border-gray-700/40
                        border-t border-l border-r border-b">
          
          {/* Header */}
          <header className={`flex justify-between items-center p-5 ${theme === "light" ? "bg-blue-600/80 text-white" : "bg-blue-900/80 text-white"} rounded-t-3xl backdrop-blur-xl shadow-md`}>
            <h1 className="text-xl md:text-2xl font-bold">
              {role === "user" ? "User Chat" : role === "manager" ? "Manager Chat" : "Admin Chat"}
            </h1>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
            {messages.length === 0 && (
              <div className={`text-center italic mt-10 ${placeholderText}`}>
                Start chatting with your AI assistant ✨
              </div>
            )}

            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-2xl shadow-md break-words prose prose-sm dark:prose-invert transform transition duration-300 cursor-pointer hover:scale-105 hover:shadow-xl ${
                    msg.sender === "user"
                      ? `${userBubble} rounded-br-none`
                      : `${aiBubble} rounded-bl-none`
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <footer className="flex items-center p-4 bg-white/20 dark:bg-gray-900/30 backdrop-blur-2xl border-t border-white/20 dark:border-gray-700/40">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className={`flex-1 p-3 rounded-3xl border border-gray-300/30 dark:border-gray-700/40 bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 dark:focus:ring-blue-600
                ${theme === "light" ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-gray-400"}`}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="ml-3 px-5 py-2 rounded-3xl bg-blue-600/90 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? "..." : "Send"}
            </button>
          </footer>
        </div>
      </div>

      {/* Page Footer */}
      <footer className={`py-4 text-center text-xs ${theme === "light" ? "text-gray-600" : "text-white/70"}`}>
        &copy; {new Date().getFullYear()} ISJPS Portal — All rights reserved.
      </footer>
    </div>
  );
}
