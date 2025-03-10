"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { database } from "@/utils/database";
import { motion } from "framer-motion";
import { sendVerificationCode } from "@/utils/email";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoadingScreen(false);
    }, 3000);
  }, []);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    setLoading(true);
    setError(""); 

    const check = await database.checkPass(email, password);
    if (!check) {
      setError("Incorrect password");
      setLoading(false);
      return;
    }

    localStorage.setItem("clientUID", check);

    const verificationCode = await sendVerificationCode(email);
    if (!verificationCode) {
      setError("Failed to send verification code. Try again.");
      setLoading(false);
      return;
    }

    setCode(verificationCode);
    setLoading(false);
    setStep(2);
  };

  const handleOtpVerify = () => {
    setLoading(true);
    if (otp === code) {
      router.push("/");
    } else {
      setError("Invalid OTP");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      {loadingScreen ? (
        <div className="flex flex-col items-center justify-between h-screen w-full bg-black text-white overflow-hidden">
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: -90, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute top-1/3 transform -translate-y-1/2 flex justify-center w-full"
          >
            <img src="/logo.png" alt="Logo" width={230} height={60} className="object-contain" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col items-center absolute bottom-12"
          >
            <motion.div
              className="flex space-x-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0 }}
              />
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
              />
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
              />
            </motion.div>
            <p className="text-gray-400 text-sm">Developed by LeiamNash</p>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-xs text-white">
          <div className="flex justify-center">
            <img src="/logo.png" alt="leiamnash" />
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <div className="mt-6 space-y-4 mb-5">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded border bg-[#262626] border-[#262626] placeholder-white"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded border bg-[#262626] border-[#262626] placeholder-white"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={togglePassword}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {error && <p className="text-red-500">{error}</p>}
              <button
                onClick={handleLogin}
                disabled={loading}
                className={`w-full py-3 mt-5 rounded-full text-lg font-bold ${
                  email && password ? "bg-[#262626] hover:bg-[#0f0f0f]" : "bg-[#0f0f0f] cursor-not-allowed"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p className="mt-4 text-center text-sm">
                New user?{" "}
                <Link href="/create" className="text-blue-400 hover:underline">
                  Create account here
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Verify your account</h2>
              <p className="mb-4 mt-2 text-sm text-gray-400">
            We've sent verify code to your email <strong>{email}</strong>
              </p>
              <input
                type="text"
                placeholder="Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 rounded border bg-[#262626] border-[#262626] placeholder-white"
              />
              {error && <p className="text-red-500">{error}</p>}
              <button
                onClick={handleOtpVerify}
                disabled={loading}
                className={`w-full py-3 mt-2 rounded-full text-lg font-bold ${
                  loading ? "bg-[#262626] hover:bg-[#0f0f0f]" : "bg-[#0f0f0f] cursor-not-allowed"
                }`}
              >
    {loading ? "Verifying..." : "Verify code"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}