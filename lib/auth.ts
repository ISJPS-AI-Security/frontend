// lib/auth.ts
export type MeResponse = { uid: string; email: string; role: "user" | "manager" | "admin"; blocked?: boolean };

export async function fetchMe(): Promise<MeResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Failed to fetch /me");
  }
  return res.json();
}
