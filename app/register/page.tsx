"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { signup } from "@/lib/firebase";

export default function RegisterPage() {
  const { toast, setRole: setThemeRole } = useTheme();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [role, setRole] = useState<"user" | "manager" | "admin">("user");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();
  setStatus("");
  setLoading(true);

  try {
    // 1. Create Firebase account
    const token = await signup(email, pass);

    // 2. Register into backend
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        password: pass,
        role,
        passcode,
      }),
    }).then((r) => r.json());

    if (res.ok) {
      toast({ title: "Registration Successful" });
      setTimeout(() => (window.location.href = "/login"), 1200);
    } else {
      setStatus("❌ " + (res.detail || "Registration failed"));
    }
  } catch (err) {
    console.error(err);
    setStatus("⚠️ Server not responding.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative flex h-screen justify-center items-center overflow-hidden px-4 bg-gradient-to-br from-blue-400 via-green-400 to-red-400">
      {/* Background Orbs */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse top-[-100px] left-[-100px]" />
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse bottom-[-100px] right-[-100px]" />

      <form
        onSubmit={handleRegister}
        className="relative z-10 backdrop-blur-lg bg-white/10 border border-white/20 dark:bg-gray-900/20 dark:border-gray-700/30 rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md"
      >
        <h1 className="text-3xl font-extrabold mb-4 text-center text-white tracking-wide drop-shadow-lg">
          Create Account ✨
        </h1>
        <p className="text-sm text-white/70 text-center mb-6">
          Sign up to start using your dashboard
        </p>

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-2xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
        />

        {/* Password */}
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Password"
          className="w-full mb-3 p-3 rounded-2xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
        />

        {/* Confirm Password */}
        <input
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          placeholder="Confirm Password"
          className="w-full mb-3 p-3 rounded-2xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
        />

        {/* Role selection pills */}
        <div className="flex justify-between mb-4">
          {["user", "manager", "admin"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r as "user" | "manager" | "admin")}
              className={`flex-1 py-2 mr-2 last:mr-0 rounded-full font-medium transition-colors duration-300 ${
                role === r
                  ? "bg-white text-blue-600 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Passcode for manager/admin */}
        <AnimatePresence>
          {(role === "manager" || role === "admin") && (
            <motion.input
              key="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={`${role} Passcode`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full mb-4 p-3 rounded-2xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
            />
          )}
        </AnimatePresence>

        {status && (
          <p className="text-sm mb-3 text-center text-white/80 font-medium">{status}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 ${
            loading ? "bg-white/30 text-white/70 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-white/80"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-4 text-white/70">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-medium underline hover:text-blue-200">
            Sign In
          </Link>
        </p>
      </form>

      {/* Footer */}
      <footer className="absolute bottom-5 text-white/70 text-xs text-center w-full">
        &copy; {new Date().getFullYear()} ISJPS Portal — All rights reserved.
      </footer>
    </div>
  );
}
