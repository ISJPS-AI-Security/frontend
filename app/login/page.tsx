"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/components/ui/ToastProvider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "manager" | "admin">("user");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if ((role === "admin" || role === "manager") && !passcode) {
        setError("Passcode is required for admin or manager login.");
        setLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      localStorage.setItem("token", token);
      document.cookie = `token=${token}; path=/; max-age=3600; secure; samesite=strict`;
      localStorage.setItem("role", role);

      toast({ title: "Login Successful", description: `Welcome, ${role}!` });

      setTimeout(() => {
        if (role === "admin") window.location.href = "/admin";
        else if (role === "manager") window.location.href = "/manager";
        else window.location.href = "/user";
      }, 800);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("Login failed. Please check credentials or try again.");
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
        onSubmit={handleLogin}
        className="relative z-10 backdrop-blur-lg bg-white/10 dark:bg-gray-900/20 border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-extrabold mb-4 text-white drop-shadow-lg">
          Sign In 👋
        </h1>
        <p className="text-sm text-white/70 mb-6">
          Enter your credentials to access your dashboard
        </p>

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full mb-3 p-3 rounded-2xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
        />

        {/* Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
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

        {error && (
          <p className="text-red-300 text-sm mb-3 text-center font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 ${
            loading ? "bg-white/30 text-white/70 cursor-not-allowed" : "bg-white text-blue-600 hover:bg-white/80"
          }`}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-sm text-center mt-4 text-white/70">
          Don’t have an account?{" "}
          <Link href="/register" className="text-white font-medium underline hover:text-blue-200">
            Register here
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
