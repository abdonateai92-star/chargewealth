"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [payments, setPayments] = useState<any[]>([]);
  const [withdraws, setWithdraws] = useState<any[]>([]);

  // ✅ تحميل الطلبات الخاصة بالمستخدم
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      // ✅ طلبات الإيداع
      const paySnap = await getDocs(
        query(
          collection(db, "payments"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        )
      );

      setPayments(
        paySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      // ✅ طلبات السحب
      const withdrawSnap = await getDocs(
        query(
          collection(db, "withdrawRequests"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        )
      );

      setWithdraws(
        withdrawSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 text-xl">
        ⏳ جاري تحميل الطلبات...
      </p>
    );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white flex justify-center items-center p-6"
    >
      <div className="w-full max-w-5xl bg-[#0f172a] rounded-3xl p-10 border border-yellow-500 shadow-xl">

        {/* ✅ العنوان */}
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-10">
          📜 سجل الطلبات
        </h1>

        {/* ✅ طلبات الإيداع */}
        <SectionTitle title="💰 طلبات الإيداع" />

        {payments.length === 0 ? (
          <EmptyText text="لا توجد طلبات إيداع حتى الآن" />
        ) : (
          payments.map((p) => (
            <OrderCard
              key={p.id}
              amount={p.amount}
              status={p.status}
              type="إيداع"
            />
          ))
        )}

        {/* ✅ طلبات السحب */}
        <SectionTitle title="🏦 طلبات السحب" />

        {withdraws.length === 0 ? (
          <EmptyText text="لا توجد طلبات سحب حتى الآن" />
        ) : (
          withdraws.map((w) => (
            <OrderCard
              key={w.id}
              amount={w.amount}
              status={w.status}
              type="سحب"
              extra={`📌 المحفظة: ${w.wallet}`}
            />
          ))
        )}

        {/* ✅ زر رجوع */}
        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-yellow-500 text-black px-10 py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 transition"
          >
            ⬅ العودة للداشبورد
          </button>
        </div>
      </div>
    </div>
  );
}

/* ✅ عنوان قسم */

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-2xl font-bold text-yellow-400 mt-8 mb-4">
      {title}
    </h2>
  );
}

/* ✅ نص فارغ */

function EmptyText({ text }: { text: string }) {
  return (
    <p className="text-gray-400 bg-[#020617] border border-gray-700 rounded-xl p-4">
      {text}
    </p>
  );
}

/* ✅ كرت طلب */

function OrderCard({
  amount,
  status,
  type,
  extra,
}: {
  amount: number;
  status: string;
  type: string;
  extra?: string;
}) {
  const statusColor =
    status === "pending"
      ? "text-yellow-400"
      : status === "approved"
      ? "text-green-400"
      : "text-red-400";

  const statusText =
    status === "pending"
      ? "قيد المراجعة"
      : status === "approved"
      ? "✅ تمت الموافقة"
      : "❌ مرفوض";

  return (
    <div className="bg-[#020617] border border-yellow-500 rounded-2xl p-6 mb-4 flex justify-between items-center">
      <div>
        <p className="text-lg font-bold text-white">
          📌 نوع الطلب: {type}
        </p>

        <p className="text-yellow-400 font-bold mt-1">
          💵 المبلغ: {amount}$ USDT
        </p>

        {extra && <p className="text-gray-400 mt-2">{extra}</p>}
      </div>

      <p className={`font-bold text-lg ${statusColor}`}>
        {statusText}
      </p>
    </div>
  );
}