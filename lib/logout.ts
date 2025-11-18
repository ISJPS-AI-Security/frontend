import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/components/ui/ToastProvider";

export function useLogout() {
  const { toast } = useToast();

  return async () => {
    try {
      // Firebase sign out (ensure it completes before redirect)
      await signOut(auth);
    } catch (err) {
      console.error("Firebase signOut failed:", err);
    }

    try {
      // Clear local storage + any cached tokens
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    } catch (err) {
      console.error("Local storage cleanup failed:", err);
    }

    // Always show feedback toast
    toast({
      title: "Logged out",
      description: "You’ve been logged out successfully.",
    });

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };
}
