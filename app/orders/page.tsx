"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ تحميل الطلبات
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const snap = await getDocs(
          query(
            collection(db, "payments"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
          )
        );

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setOrders(data);
      } catch (err) {
        console.log("❌ خطأ في تحميل الطلبات:", err);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ✅ Loading
  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 text-xl">
        ⏳ جاري تحميل الطلبات...
      </p>
    );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white flex justify-center p-10"
    >
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
          📜 طلباتي
        </h1>

        {orders.length === 0 && (
          <p className="text-gray-400 text-center">
            ✅ لا توجد طلبات حتى الآن
          </p>
        )}

        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-[#020617] border border-yellow-500 rounded-2xl p-6 mb-4"
          >
            <p className="text-lg font-bold text-yellow-400">
              💵 مبلغ الإيداع: {o.amount}$
            </p>

            <p className="text-gray-300 mt-2">
              📌 الحالة:{" "}
              <span
                className={`font-bold ${
                  o.status === "pending"
                    ? "text-yellow-400"
                    : o.status === "approved"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {o.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}