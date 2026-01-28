"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] flex justify-center items-center px-6"
    >
      {/* ✅ Card */}
      <div className="w-full max-w-4xl bg-[#020617]/80 border border-yellow-500 rounded-[40px] shadow-2xl backdrop-blur-xl p-14 text-center">

        {/* ✅ Logo + Title */}
        <h1 className="text-6xl font-extrabold text-yellow-400 mb-4 drop-shadow-lg">
          ⚡ Charge Wealth
        </h1>

        <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed mb-10">
          منصة استثمار حديثة تمنحك أرباح يومية ثابتة  
          وسحب سريع وأمان كامل بأفضل تجربة مستخدم 💰
        </p>

        {/* ✅ Buttons */}
        <div className="flex flex-col md:flex-row gap-5 justify-center mb-10">

          {/* ✅ Login */}
          <button
            onClick={() => router.push("/login")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-full font-bold text-xl transition shadow-lg"
          >
            🔐 تسجيل الدخول
          </button>

          {/* ✅ Register */}
          <button
            onClick={() => router.push("/register")}
            className="bg-[#0f172a] border border-yellow-500 hover:bg-yellow-500 hover:text-black px-10 py-4 rounded-full font-bold text-xl transition shadow-lg"
          >
            ✨ إنشاء حساب جديد
          </button>
        </div>

        {/* ✅ Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 text-right">

          <FeatureCard
            title="📈 أرباح يومية"
            desc="احصل على دخل ثابت يوميًا من خلال باقات استثمار مضمونة."
          />

          <FeatureCard
            title="🏦 سحب سريع"
            desc="طلبات السحب يتم تنفيذها خلال 4 أيام عمل بكل سهولة."
          />

          <FeatureCard
            title="🔒 أمان كامل"
            desc="نظام آمن وبيانات محمية بالكامل داخل Firestore."
          />
        </div>

        {/* ✅ Footer */}
        <p className="text-gray-500 text-sm mt-14">
          © {new Date().getFullYear()} Charge Wealth — جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}

/* ✅ Feature Card Component */
function FeatureCard({ title, desc }: any) {
  return (
    <div className="bg-[#0f172a] border border-yellow-500 rounded-2xl p-6 shadow-md hover:scale-[1.03] transition">
      <h2 className="text-xl font-bold text-yellow-400 mb-3">{title}</h2>
      <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}