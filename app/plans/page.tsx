"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { useRouter } from "next/navigation";

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const router = useRouter();

  // ✅ تحميل الباقات الفعالة فقط
  useEffect(() => {
    const fetchPlans = async () => {
      const q = query(
        collection(db, "plans"),
        where("active", "==", true),
        orderBy("createdAt", "desc")
      );

      const snap = await getDocs(q);

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPlans(data);
    };

    fetchPlans();
  }, []);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white px-6 py-14"
    >
      {/* ✅ Header */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-extrabold text-yellow-400 mb-4">
          📦 الباقات الاستثمارية
        </h1>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          اختر الباقة المناسبة وابدأ الاستثمار مع منصة{" "}
          <span className="text-yellow-400 font-bold">
            Charge Wealth
          </span>
        </p>
      </div>

      {/* ✅ Plans */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-[#020617] border border-yellow-500 rounded-3xl p-8 shadow-xl"
          >
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              {plan.name}
            </h2>

            <p className="text-gray-300 mb-2">
              💳 السعر:
              <span className="text-yellow-400 font-bold text-2xl ml-2">
                {plan.price}$
              </span>
            </p>

            <p className="text-gray-300 mb-6">
              📈 الربح اليومي:
              <span className="text-green-400 font-bold text-xl ml-2">
                {plan.dailyProfit}$
              </span>
            </p>

            {/* ✅ Subscribe */}
            <button
              onClick={() =>
                router.push(`/deposit?plan=${plan.id}`)
              }
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg transition"
            >
              🚀 اشترك الآن
            </button>
          </div>
        ))}
      </div>

      {/* ✅ لو مفيش باقات */}
      {plans.length === 0 && (
        <p className="text-center text-gray-500 mt-20 text-xl">
          ⚠️ لا توجد باقات متاحة الآن
        </p>
      )}
    </div>
  );
}