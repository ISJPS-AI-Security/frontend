"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, loadingUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // wait until user is loaded from backend
    if (user) {
      const roleRouteMap: Record<string, string> = {
        user: "/user",
        admin: "/admin",
        manager: "/manager",
        editor: "/editor", // add more roles as needed
      };

      // if allowedRoles is specified, check
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        const redirectRoute = roleRouteMap[user.role] || "/user";
        router.replace(redirectRoute);
        return;
      }

      // otherwise, allow access
    }
  }, [user, allowedRoles, router]);

  // token missing → redirecting
  if (typeof window !== "undefined" && !localStorage.getItem("token"))
    return <div className="p-6">Redirecting...</div>;

  // still loading user → show loader
  if (loadingUser || !user) return <div className="p-6">Loading...</div>;

  return <>{children}</>;
}
