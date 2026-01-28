"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function WithdrawPage() {
  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState(0);

  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");

  const [status, setStatus] = useState<string>("لا يوجد طلب بعد");
  const [loading, setLoading] = useState(true);

  /* ✅ تحميل بيانات المستخدم + آخر طلب */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {

      // ✅ لو المستخدم مش مسجل دخول → وقف التحميل بدل اللوب اللانهائي
      if (!u) {
        setLoading(false);
        return;
      }

      setUser(u);

      // ✅ تحميل الرصيد
      const snap = await getDocs(
        query(collection(db, "users"), where("email", "==", u.email))
      );

      if (!snap.empty) {
        const data: any = snap.docs[0].data();
        setBalance(data.balance || 0);
      }

      // ✅ تحميل آخر طلب سحب
      const lastReq = await getDocs(
        query(
          collection(db, "withdrawRequests"),
          where("userId", "==", u.uid),
          orderBy("createdAt", "desc"),
          limit(1)
        )
      );

      if (!lastReq.empty) {
        setStatus(lastReq.docs[0].data().status);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ✅ إرسال طلب السحب */

  const submitWithdraw = async () => {
    const numAmount = Number(amount);

    if (!wallet || !amount)
      return alert("❌ برجاء إدخال البيانات كاملة");

    if (numAmount < 50)
      return alert("❌ أقل مبلغ سحب هو 50 دولار");

    if (numAmount > balance)
      return alert("❌ لا يوجد رصيد كافي للسحب");

    await addDoc(collection(db, "withdrawRequests"), {
      userId: user.uid,
      amount: numAmount,
      wallet,
      status: "pending",
      createdAt: new Date(),
    });

    alert("✅ تم إرسال طلب السحب بنجاح");
    setStatus("pending");
    setAmount("");
    setWallet("");
  };

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 text-xl">
        ⏳ جاري تحميل صفحة السحب...
      </p>
    );

  // ✅ لو المستخدم مش عامل تسجيل دخول
  if (!user)
    return (
      <p className="text-center text-red-400 mt-20 text-xl">
        ❌ يجب تسجيل الدخول أولاً
      </p>
    );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white flex justify-center items-center p-6"
    >
      <div className="w-full max-w-xl bg-[#020617]/80 border border-yellow-500 rounded-3xl p-10 shadow-xl backdrop-blur-lg">
        {/* ✅ عنوان */}
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">
          💸 طلب سحب الأرباح
        </h1>

        {/* ✅ تنبيه */}
        <div className="bg-yellow-500/10 border border-yellow-400 text-yellow-300 p-4 rounded-xl mb-6 text-sm leading-relaxed">
          ⚠️ أقل مبلغ للسحب هو <b>50$</b> <br />
          ⏳ يتم تنفيذ السحب خلال <b>4 أيام عمل</b>
        </div>

        {/* ✅ الرصيد */}
        <div className="mb-6 text-lg text-center">
          💰 رصيدك الحالي:{" "}
          <span className="text-yellow-400 font-bold">
            {balance}$
          </span>
        </div>

        {/* ✅ حالة الطلب */}
        <div className="mb-6 text-center">
          📌 حالة آخر طلب:
          <span
            className={`font-bold px-3 ${
              status === "pending"
                ? "text-yellow-400"
                : status === "approved"
                ? "text-green-400"
                : status === "rejected"
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {status}
          </span>
        </div>

        {/* ✅ إدخال المحفظة */}
        <input
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="🏦 عنوان محفظة USDT"
          className="w-full p-4 rounded-xl bg-black border border-yellow-500 mb-4 focus:outline-none"
        />

        {/* ✅ إدخال المبلغ */}
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="💵 مبلغ السحب بالدولار"
          type="number"
          className="w-full p-4 rounded-xl bg-black border border-yellow-500 mb-6 focus:outline-none"
        />

        {/* ✅ زر السحب */}
        <button
          onClick={submitWithdraw}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg transition"
        >
          ✅ إرسال طلب السحب
        </button>
      </div>
    </div>
  );
}