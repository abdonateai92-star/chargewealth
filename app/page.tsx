"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-[#050505] to-[#111] flex justify-center items-center px-6"
    >
      <div className="w-full max-w-4xl border-2 border-yellow-500 rounded-[40px] p-10 bg-[#0b1220]/90 shadow-2xl">

        {/* ✅ Logo + Title */}
        <h1 className="text-5xl font-extrabold text-yellow-400 text-center mb-3">
          Charge Wealth ⚡
        </h1>

        <p className="text-center text-gray-300 mb-10 text-lg">
          منصة استثمار حديثة تمنحك أرباح يومية وسحب سريع بأمان كامل
        </p>

        {/* ✅ Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-5 mb-12">

          <button
            onClick={() => router.push("/login")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-10 py-4 rounded-full text-lg transition"
          >
            🔐 تسجيل الدخول
          </button>

          <button
            onClick={() => router.push("/register")}
            className="border border-yellow-400 hover:bg-yellow-500 hover:text-black text-yellow-400 font-bold px-10 py-4 rounded-full text-lg transition"
          >
            ✨ إنشاء حساب جديد
          </button>

        </div>

        {/* ✅ Features Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          <FeatureCard
            title="🔒 أمان كامل"
            desc="بياناتك محمية بالكامل داخل نظام Firestore"
          />

          <FeatureCard
            title="⚡ سحب سريع"
            desc="طلبات السحب تتم مراجعتها خلال 4 أيام عمل"
          />

          <FeatureCard
            title="💰 أرباح يومية"
            desc="احصل على أرباح ثابتة يومياً حسب الباقة"
          />

        </div>

        {/* ✅ Footer */}
        <p className="text-center text-gray-500 mt-12 text-sm">
          © Charge Wealth 2026 — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}

/* ✅ Feature Card Component */

function FeatureCard({ title, desc }: any) {
  return (
    <div className="bg-[#0f172a] border border-yellow-500 rounded-2xl p-6 text-center hover:scale-[1.03] transition">
      <h2 className="text-xl font-bold text-yellow-400 mb-2">{title}</h2>
      <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}