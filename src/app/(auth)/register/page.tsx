import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">DeadLine</h1>
          <p className="text-zinc-400">AI-Powered Project Management</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
