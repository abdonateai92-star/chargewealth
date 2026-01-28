"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/firebase";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function InvitePage() {
  const [userId, setUserId] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ✅ تحميل المستخدم */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);

        // ✅ تحميل الناس اللي سجلوا برابطه
        const snap = await getDocs(
          query(
            collection(db, "users"),
            where("refBy", "==", user.uid)
          )
        );

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReferrals(data);
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  /* ✅ رابط الدعوة */
  const link =
    userId !== ""
      ? `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${userId}`
      : "";

  /* ✅ عدد اللي شحنوا */
  const chargedCount = referrals.filter((u) => u.balance > 0).length;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white flex justify-center items-center p-6"
    >
      <div className="w-full max-w-2xl bg-[#020617] border border-yellow-500 rounded-3xl p-10 shadow-xl">

        {/* ✅ Title */}
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-6">
          👥 دعوة الأصدقاء
        </h1>

        {/* ✅ Offer */}
        <div className="bg-yellow-500/10 border border-yellow-400 p-4 rounded-xl text-center text-yellow-300 mb-8">
          🎁 أي صديق يسجل من رابطك ثم يقوم بالشحن → تربح{" "}
          <span className="font-bold text-green-400">10$</span> فورًا ✅
        </div>

        {/* ✅ Link */}
        <p className="text-gray-300 text-center mb-3">
          رابط الدعوة الخاص بك:
        </p>

        <div className="bg-black border border-yellow-400 rounded-xl p-4 text-center text-yellow-300 break-words mb-5">
          {link || "⏳ جاري تحميل رابط الدعوة..."}
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(link);
            alert("✅ تم نسخ رابط الدعوة!");
          }}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg transition mb-10"
        >
          📌 نسخ رابط الدعوة
        </button>

        {/* ✅ Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#0f172a] border border-yellow-500 rounded-2xl p-5 text-center">
            <p className="text-gray-400">👤 عدد المنضمين</p>
            <p className="text-3xl font-bold text-yellow-400">
              {referrals.length}
            </p>
          </div>

          <div className="bg-[#0f172a] border border-green-500 rounded-2xl p-5 text-center">
            <p className="text-gray-400">💰 عدد اللي شحنوا</p>
            <p className="text-3xl font-bold text-green-400">
              {chargedCount}
            </p>
          </div>
        </div>

        {/* ✅ List */}
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">
          📋 قائمة الأصدقاء المنضمين
        </h2>

        {loading && (
          <p className="text-gray-400 text-center">
            ⏳ جاري تحميل البيانات...
          </p>
        )}

        {!loading && referrals.length === 0 && (
          <p className="text-gray-400 text-center">
            ❌ لا يوجد أصدقاء انضموا بعد
          </p>
        )}

        {/* ✅ Referrals Table */}
        <div className="space-y-4">
          {referrals.map((u) => (
            <div
              key={u.id}
              className="bg-[#0f172a] border border-gray-600 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-bold">
                  👤 {u.username || "مستخدم جديد"}
                </p>
                <p className="text-gray-400 text-sm">
                  📧 {u.email}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-xl font-bold text-sm ${
                  u.balance > 0
                    ? "bg-green-500 text-black"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {u.balance > 0 ? "✅ شحن" : "⏳ لم يشحن"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}