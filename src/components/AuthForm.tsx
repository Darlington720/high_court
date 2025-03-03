import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader, AlertTriangle } from "lucide-react";
import { Button } from "./ui/Button";
import { signIn, signUp } from "../lib/auth";
import AppContext from "../context/AppContext";
import { supabase } from "../lib/supabase";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const appContext = useContext(AppContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      const { data, error } =
        mode === "login"
          ? await signIn(email, password)
          : await signUp(email, password);

      if (error) {
        throw new Error(error.message);
      }

      if (mode === "login") {
        const { data: _data, error } = await supabase
          .from("_users")
          .select()
          .eq("id", data?.user?.id);

        if (error) {
          throw new Error(error.message);
        }

        const user = { ...data?.user, ..._data[0] };
        appContext?.setUser(user);

        // store the user login

        const { data: userLoginData, error: userLoginErr } = await supabase
          .from("user_logins")
          .insert([{ user_id: data?.user?.id }])
          .select();

        if (userLoginErr) {
          throw new Error(userLoginErr.message);
        }

        if (user.user_role == "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-800">
          {mode === "login" ? "Welcome Back!" : "Create Your Account"}
        </h2>
        <p className="text-center text-sm text-gray-500 mt-2">
          {mode === "login"
            ? "Sign in to continue"
            : "Join us by creating an account"}
        </p>

        {error && (
          <div className="mt-4 flex items-center rounded-lg bg-red-100 p-3 text-red-600">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-lg bg-green-100 p-3 text-green-600">
            <p className="text-sm">{success}</p>
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 pl-10 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 shadow-sm transition duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full transform rounded-lg bg-blue-500 px-4 py-2 text-lg font-semibold text-white transition duration-300 hover:bg-blue-600 hover:shadow-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
