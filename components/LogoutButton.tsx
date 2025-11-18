"use client";
import { useLogout } from "@/lib/logout";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function LogoutButton() {
  const logout = useLogout();
  return (
    <motion.button
      onClick={logout}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition-all duration-200"
    >
      <LogOut size={18} />
    </motion.button>
  );
}
