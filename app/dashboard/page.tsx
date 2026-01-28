"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white flex justify-center items-center"
    >
      <div className="w-[95%] max-w-6xl bg-[#0f172a] rounded-3xl p-6 shadow-xl">

        {/* ✅ Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-400">
            ⚡ Charge Wealth
          </h1>

          <button className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold">
            لوحة التحكم
          </button>
        </div>

        {/* ✅ Banner Section */}
        <div className="bg-gradient-to-r from-[#111827] to-[#0b1220] rounded-3xl p-8 flex justify-between items-center mb-8 border border-yellow-500">

          <div>
            <h2 className="text-4xl font-bold mb-3 text-yellow-400">
              مرحباً بك في Charge Wealth
            </h2>

            <p className="text-gray-300 text-lg mb-5">
              استثمر بسهولة وحقق أرباح يومية بأمان
            </p>

            <button
              onClick={() => router.push("/deposit")}
              className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold text-lg"
            >
              ابدأ الآن
            </button>
          </div>

          <div className="hidden md:block text-[90px]">
            ⚡
          </div>
        </div>

        {/* ✅ Quick Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <QuickBtn title="💰 الإيداع" onClick={() => router.push("/deposit")} />
          <QuickBtn title="🏦 السحب" onClick={() => router.push("/withdraw")} />
          <QuickBtn title="👥 دعوة الأصدقاء" onClick={() => router.push("/invite")} />
          <QuickBtn title="🤝 الشركاء" onClick={() => router.push("/partners")} />

        </div>

        {/* ✅ Status Section */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* ✅ Circle Progress */}
          <div className="bg-[#020617] border border-yellow-500 rounded-3xl p-10 flex flex-col items-center justify-center">

            <div className="w-44 h-44 rounded-full border-[10px] border-yellow-400 flex items-center justify-center text-center">
              <div>
                <h2 className="text-4xl font-bold text-yellow-400">75%</h2>
                <p className="text-gray-400 mt-2">الأرباح اليومية</p>
              </div>
            </div>

          </div>

          {/* ✅ Info Box */}
          <div className="bg-[#020617] border border-yellow-500 rounded-3xl p-10 flex flex-col justify-center">

            <h2 className="text-3xl font-bold mb-4 text-yellow-400">
              جاري تشغيل النظام...
            </h2>

            <p className="text-gray-300 text-lg mb-6">
              يتم تحديث أرباحك تلقائياً كل يوم ✅
            </p>

            <div className="bg-black border border-yellow-400 rounded-full px-6 py-4 text-center text-2xl font-bold">
              ⏳ 22:15:30
            </div>

          </div>

        </div>

        {/* ✅ Bottom Navigation */}
        <div className="mt-10 border-t border-gray-700 pt-6 flex justify-around text-gray-400 text-lg">

          <NavItem title="🏠 الرئيسية" active />
          <NavItem title="💰 الرصيد" />
          <NavItem title="📜 الطلبات" />
          <NavItem title="👤 الحساب" />

        </div>

      </div>
    </div>
  );
}

/* ✅ Quick Button */

function QuickBtn({ title, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-[#020617] border border-yellow-500 rounded-2xl p-5 text-center font-bold text-lg hover:bg-yellow-500 hover:text-black transition"
    >
      {title}
    </button>
  );
}

/* ✅ Nav Item */

function NavItem({ title, active }: any) {
  return (
    <div className={`${active ? "text-yellow-400 font-bold" : ""}`}>
      {title}
    </div>
  );
}