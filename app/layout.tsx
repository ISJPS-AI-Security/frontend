import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/app/context/AuthContext";

export const metadata = {
  title: "ISJPS AI Assistant",
  description: "Role-based intelligent system for user, manager, and admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Auth and Theme context providers */}
        <AuthProvider>
          <ThemeProvider>
            {/* Toast system provider */}
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
