"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/app/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [balance, setBalance] = useState(0);

  const [mining, setMining] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // ✅ مدة التعدين = 3 ساعات فقط
  const miningHours = 3;
  const miningSeconds = miningHours * 60 * 60;

  // ✅ الربح بعد انتهاء التعدين
  const profitReward = 1;

  /* ✅ تحميل بيانات المستخدم + التعدين */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;

      setUserId(u.uid);

      const userRef = doc(db, "users", u.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data: any = snap.data();

        setBalance(data.balance || 0);

        // ✅ لو تعدين شغال قبل كدة
        if (data.miningStart) {
          const startTime = data.miningStart.seconds * 1000;
          const now = Date.now();

          const passed = Math.floor((now - startTime) / 1000);
          const remaining = miningSeconds - passed;

          if (remaining > 0) {
            setMining(true);
            setTimeLeft(remaining);
          } else {
            // ✅ انتهت المدة ولم يأخذ الربح بعد
            if (!data.miningRewarded) {
              await updateDoc(userRef, {
                balance: increment(profitReward),
                miningRewarded: true,
                miningStart: null,
              });

              setBalance((b) => b + profitReward);
            }

            setMining(false);
            setTimeLeft(0);
          }
        }
      }
    });

    return () => unsub();
  }, []);

  /* ✅ Countdown Timer */

  useEffect(() => {
    if (!mining) return;

    const timer = setInterval(async () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishMining();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mining]);

  /* ✅ إنهاء التعدين + إضافة الأرباح */

  const finishMining = async () => {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      balance: increment(profitReward),
      miningRewarded: true,
      miningStart: null,
    });

    alert("✅ انتهى التعدين وتم إضافة الأرباح!");

    setBalance((b) => b + profitReward);
    setMining(false);
    setTimeLeft(0);
  };

  /* ✅ بدء التعدين (مرة واحدة يومياً) */

  const startMining = async () => {
    const today = new Date().toISOString().split("T")[0];

    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) return;

    const data: any = snap.data();

    // ✅ ممنوع يبدأ أكثر من مرة في نفس اليوم
    if (data.lastMiningDay === today) {
      return alert("❌ يمكنك التعدين مرة واحدة فقط يومياً");
    }

    await updateDoc(userRef, {
      miningStart: new Date(),
      miningRewarded: false,
      lastMiningDay: today,
    });

    alert("✅ بدأ التعدين لمدة 3 ساعات!");

    setMining(true);
    setTimeLeft(miningSeconds);
  };

  /* ✅ تنسيق الوقت */

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white flex justify-center items-center"
    >
      <div className="w-[95%] max-w-5xl bg-[#0f172a] rounded-3xl p-10 border border-yellow-500">

        {/* ✅ عنوان */}
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-6">
          ⚡ Charge Wealth Dashboard
        </h1>

        {/* ✅ الرصيد */}
        <div className="text-center mb-6 text-2xl">
          💰 رصيدك الحالي:{" "}
          <span className="text-yellow-400 font-bold">{balance}$</span>
        </div>

        {/* ✅ التعدين */}
        <div className="bg-[#020617] border border-yellow-500 rounded-3xl p-10 text-center">

          <h2 className="text-3xl font-bold text-yellow-400 mb-4">
            🔋 PowerBank Mining
          </h2>

          {!mining ? (
            <button
              onClick={startMining}
              className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold text-lg"
            >
              ✅ ابدأ التعدين لمدة 3 ساعات
            </button>
          ) : (
            <div>
              <p className="text-gray-300 mb-4 text-lg">
                ⏳ التعدين جاري... يرجى الانتظار
              </p>

              <div className="text-4xl font-bold text-yellow-400">
                {formatTime(timeLeft)}
              </div>
            </div>
          )}

          <p className="mt-6 text-gray-400 text-sm">
            ✅ يمكنك التعدين مرة واحدة فقط يومياً
          </p>
        </div>

        {/* ✅ أزرار */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => router.push("/withdraw")}
            className="bg-red-600 text-white py-4 rounded-xl font-bold"
          >
            🏦 سحب الأرباح
          </button>

          <button
            onClick={() => router.push("/deposit")}
            className="bg-green-500 text-black py-4 rounded-xl font-bold"
          >
            💰 شحن الحساب
          </button>
        </div>
      </div>
    </div>
  );
}