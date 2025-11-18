"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-5">
      <h2 className="text-xl font-bold mb-6">ISJPS Admin</h2>
      <ul className="space-y-3">
        <li><Link href="/admin">📊 Logs Dashboard</Link></li>
        <li><Link href="/admin/users">👤 Manage Users</Link></li>
      </ul>
    </div>
  );
}
