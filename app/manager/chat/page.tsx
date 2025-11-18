"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/ToastProvider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ManagerChatPage() {
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
          : data.generation?.text
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

  // Green-themed bubbles
  const userBubble = "bg-green-200/80 text-green-900 dark:bg-green-800 dark:text-white";
  const aiBubble = "bg-white/50 text-gray-900 dark:bg-gray-900/60 dark:text-gray-100";
  const placeholderText = "text-gray-700 dark:text-gray-400";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-green-50 via-green-100 to-green-200 dark:from-green-950 dark:via-green-900 dark:to-green-950 relative">

      {/* Main Chat Panel */}
      <div className="flex justify-center items-start pt-16 px-4 md:px-0">
        <div className="w-full max-w-3xl h-[80vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden
                        bg-white/20 dark:bg-green-900/30 backdrop-blur-2xl border border-white/20 dark:border-green-700/40">

          {/* Header */}
          <header className="flex justify-between items-center p-5 bg-green-600/80 text-white rounded-t-3xl backdrop-blur-xl shadow-md">
            <h1 className="text-xl md:text-2xl font-bold">Manager Chat</h1>
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
          <footer className="flex items-center p-4 bg-white/20 dark:bg-green-900/30 backdrop-blur-2xl border-t border-white/20 dark:border-green-700/40">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-3xl border border-gray-300/30 dark:border-green-700/40 bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400 dark:focus:ring-green-600 text-gray-900 dark:text-white placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="ml-3 px-5 py-2 rounded-3xl bg-green-600/90 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? "..." : "Send"}
            </button>
          </footer>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-600 dark:text-white/70">
        &copy; {new Date().getFullYear()} ISJPS Portal — All rights reserved.
      </footer>
    </div>
  );
}
