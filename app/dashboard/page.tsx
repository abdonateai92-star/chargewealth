"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function DashboardPage() {
  const router = useRouter();

  const [balance, setBalance] = useState(0);

  // ✅ التعدين
  const [mining, setMining] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // ✅ تحميل الرصيد من Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setBalance((snap.data() as any).balance || 0);
      }
    });

    return () => unsub();
  }, []);

  // ✅ تشغيل عداد 12 ساعة
  useEffect(() => {
    if (!mining) return;

    if (secondsLeft <= 0) {
      setMining(false);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [mining, secondsLeft]);

  // ✅ تحويل الوقت لصيغة HH:MM:SS
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ✅ نسبة الأرباح تلف
  const progress =
    mining && secondsLeft > 0
      ? Math.floor(((43200 - secondsLeft) / 43200) * 100)
      : 0;

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

        {/* ✅ Banner */}
        <div className="bg-gradient-to-r from-[#111827] to-[#0b1220] rounded-3xl p-8 flex justify-between items-center mb-8 border border-yellow-500">
          <div>
            <h2 className="text-4xl font-bold mb-3 text-yellow-400">
              مرحباً بك في Charge Wealth
            </h2>

            <p className="text-gray-300 text-lg mb-5">
              استثمر بسهولة وحقق أرباح يومية بأمان
            </p>

            <button
              onClick={() => router.push("/packages")}
              className="bg-yellow-500 text-black px-8 py-3 rounded-full font-bold text-lg"
            >
              عرض الباقات
            </button>
          </div>

          <div className="hidden md:block text-[90px]">⚡</div>
        </div>

        {/* ✅ الرصيد */}
        <div className="text-center text-xl mb-8">
          💰 رصيد حسابك الحالي:
          <span className="text-yellow-400 font-bold"> {balance}$</span>
        </div>

        {/* ✅ Quick Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <QuickBtn title="💰 الإيداع" onClick={() => router.push("/packages")} />
          <QuickBtn title="🏦 السحب" onClick={() => router.push("/withdraw")} />
          <QuickBtn title="👥 دعوة الأصدقاء" onClick={() => router.push("/invite")} />
          <QuickBtn title="🤝 الشركاء" onClick={() => router.push("/partners")} />

        </div>

        {/* ✅ Status Section */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* ✅ دائرة الأرباح */}
          <div className="bg-[#020617] border border-yellow-500 rounded-3xl p-10 flex flex-col items-center justify-center">
            <div className="w-44 h-44 rounded-full border-[10px] border-yellow-400 flex items-center justify-center text-center">
              <div>
                <h2 className="text-4xl font-bold text-yellow-400">
                  {progress}%
                </h2>
                <p className="text-gray-400 mt-2">
                  الأرباح اليومية
                </p>
              </div>
            </div>
          </div>

          {/* ✅ Mining Box */}
          <div className="bg-[#020617] border border-yellow-500 rounded-3xl p-10 flex flex-col justify-center">

            <h2 className="text-3xl font-bold mb-4 text-yellow-400">
              {mining
                ? "✅ التعدين يعمل الآن"
                : "🔋 يرجى الضغط لتشغيل الباور بنك"}
            </h2>

            <p className="text-gray-300 text-lg mb-6">
              التعدين لمدة 12 ساعة يومياً ثم يمكنك السحب ✅
            </p>

            {/* ✅ Timer */}
            {mining && (
              <div className="bg-black border border-yellow-400 rounded-full px-6 py-4 text-center text-2xl font-bold mb-4">
                ⏳ {formatTime(secondsLeft)}
              </div>
            )}

            {/* ✅ Start Mining Button */}
            {!mining && (
              <button
                onClick={() => {
                  setMining(true);
                  setSecondsLeft(43200); // ✅ 12 ساعة
                }}
                className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition"
              >
                ⚡ ابدأ التعدين الآن
              </button>
            )}
          </div>

        </div>

        {/* ✅ Bottom Navigation */}
        <div className="mt-10 border-t border-gray-700 pt-6 flex justify-around text-gray-400 text-lg">

          <NavItem title="🏠 الرئيسية" active />
          <NavItem title="💰 الرصيد" onClick={() => router.push("/balance")} />
          <NavItem title="📜 الطلبات" onClick={() => router.push("/orders")} />
          <NavItem title="👤 الحساب" onClick={() => router.push("/profile")} />

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
function NavItem({ title, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`${
        active ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
      }`}
    >
      {title}
    </button>
  );
}