"use client";

import { useRouter } from "next/navigation";

export default function PlansPage() {
  const router = useRouter();

  // ✅ الباقات ثابتة
  const plans = [
    { id: 1, name: "باقة البداية", price: 80, profit: 1 },
    { id: 2, name: "باقة متوسطة", price: 150, profit: 3 },
    { id: 3, name: "باقة قوية", price: 300, profit: 6 },
    { id: 4, name: "باقة VIP", price: 500, profit: 8 },
    { id: 5, name: "باقة الأسطورة", price: 1000, profit: 10 },
  ];

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white px-6 py-16"
    >
      {/* ✅ Header */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-4">
          📦 الباقات الاستثمارية
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          اختر الباقة المناسبة وابدأ الاستثمار مع منصة{" "}
          <span className="text-yellow-400 font-bold">Charge Wealth</span> 💰
        </p>
      </div>

      {/* ✅ Plans Grid */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-[#020617] border border-yellow-500 rounded-3xl p-8 shadow-xl hover:scale-[1.05] transition duration-300"
          >
            {/* ✅ Plan Name */}
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              {plan.name}
            </h2>

            {/* ✅ Price */}
            <p className="text-gray-300 text-lg mb-3">
              💳 السعر:
              <span className="text-yellow-400 font-bold text-2xl ml-2">
                {plan.price}$
              </span>
            </p>

            {/* ✅ Profit */}
            <p className="text-gray-300 text-lg mb-6">
              📈 الربح اليومي:
              <span className="text-green-400 font-bold text-xl ml-2">
                {plan.profit}$
              </span>
            </p>

            {/* ✅ Features */}
            <ul className="text-gray-400 text-sm space-y-2 mb-8">
              <li>✅ أرباح يومية ثابتة</li>
              <li>✅ سحب خلال 4 أيام عمل</li>
              <li>✅ دعم فني مباشر</li>
              <li>✅ نظام استثمار آمن 100%</li>
            </ul>

            {/* ✅ Subscribe Button */}
            <button
              onClick={() => router.push("/deposit")}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg transition"
            >
              🚀 اشترك الآن
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}