import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - DeadLine ",
  description: "Login or register to access DeadLine ",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
