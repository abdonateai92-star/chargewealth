"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return alert("❌ أدخل البيانات كاملة");

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      alert("✅ تم تسجيل الدخول بنجاح");

      // ✅ يدخل على الداشبورد الأول بدل صفحة السحب
      router.push("/dashboard");
    } catch (err) {
      alert("❌ البريد أو كلمة المرور خطأ");
    }

    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex justify-center items-center bg-[#0b1220] text-white"
    >
      <div className="bg-[#020617] border border-yellow-500 rounded-2xl p-10 w-[420px] shadow-xl">
        
        {/* ✅ اسم المنصة فوق */}
        <h2 className="text-center text-xl text-gray-400 mb-2">
          ⚡ منصة Charge Wealth
        </h2>

        {/* ✅ العنوان */}
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          🔐 تسجيل دخول الأدمن
        </h1>

        {/* ✅ وصف بسيط */}
        <p className="text-center text-gray-500 mb-6 text-sm">
          أدخل بياناتك للدخول إلى لوحة التحكم
        </p>

        {/* ✅ Email */}
        <input
          type="email"
          placeholder="📧 البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-yellow-500 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        {/* ✅ Password */}
        <input
          type="password"
          placeholder="🔑 كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-yellow-500 mb-6 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />

        {/* ✅ Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
        >
          {loading ? "⏳ جاري الدخول..." : "✅ تسجيل الدخول"}
        </button>

        {/* ✅ Footer */}
        <p className="text-center text-gray-600 mt-6 text-xs">
          جميع الحقوق محفوظة © Charge Wealth 2026
        </p>
      </div>
    </div>
  );
}