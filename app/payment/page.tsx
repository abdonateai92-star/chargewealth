"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const packageId = searchParams.get("package");

  // ✅ بيانات الباقات
  const packages: any = {
    1: { price: 80, profit: 1 },
    2: { price: 150, profit: 3 },
    3: { price: 300, profit: 6 },
    4: { price: 500, profit: 8 },
    5: { price: 1000, profit: 10 },
  };

  const selectedPackage = packages[packageId || "1"];

  // ✅ بيانات المستخدم
  const [userId, setUserId] = useState("");

  // ✅ Inputs جديدة
  const [amount, setAmount] = useState(selectedPackage.price);
  const [txid, setTxid] = useState("");

  // ✅ تحميل المستخدم الحالي
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });

    return () => unsub();
  }, []);

  // ✅ عنوان المحفظة
  const walletAddress = "TWa3Jc6572z52K1EkLReXJUEFF11a8C7jT";

  // ✅ إرسال طلب الإيداع للأدمن
  const confirmPayment = async () => {
    if (!userId) return alert("❌ لازم تسجل دخول الأول");

    if (!txid)
      return alert("❌ لازم تدخل رقم العملية Transaction Hash (TXID)");

    await addDoc(collection(db, "payments"), {
      userId: userId,

      // ✅ المستخدم يكتب بنفسه المبلغ اللي حوله
      amount: Number(amount),

      packageId: Number(packageId),

      // ✅ رقم العملية
      txid: txid,

      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("✅ تم إرسال طلب الإيداع للإدارة بنجاح");

    router.push("/dashboard");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex justify-center items-center bg-[#0b1220] text-white p-6"
    >
      <div className="w-full max-w-md bg-[#020617] border border-yellow-500 rounded-3xl p-8 shadow-xl">
        {/* ✅ Title */}
        <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">
          💳 الدفع عبر USDT
        </h1>

        {/* ✅ Package Info */}
        <div className="bg-black/40 border border-yellow-500 rounded-xl p-4 mb-6">
          <p className="mb-2">
            ⭐ الباقة المختارة:{" "}
            <span className="text-yellow-400 font-bold">#{packageId}</span>
          </p>

          <p className="mb-2">
            💰 السعر الرسمي:{" "}
            <span className="text-yellow-400 font-bold">
              {selectedPackage.price}$ USDT
            </span>
          </p>

          <p>
            📈 الربح اليومي:{" "}
            <span className="text-green-400 font-bold">
              {selectedPackage.profit}$ يومياً
            </span>
          </p>
        </div>

        {/* ✅ Wallet */}
        <h2 className="text-lg mb-2">✅ أرسل المبلغ إلى المحفظة:</h2>

        <div className="bg-black border border-yellow-500 rounded-xl p-4 text-yellow-400 font-bold text-sm text-center break-words mb-6">
          {walletAddress}
        </div>

        {/* ✅ Input Amount */}
        <label className="block mb-2 text-gray-300">
          💵 أدخل المبلغ الذي قمت بتحويله:
        </label>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 mb-5 rounded-xl bg-black border border-gray-600 focus:border-yellow-400 outline-none"
        />

        {/* ✅ Input TXID */}
        <label className="block mb-2 text-gray-300">
          🔗 أدخل رقم العملية Transaction Hash (TXID):
        </label>

        <input
          type="text"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          placeholder="مثال: 9d8f7a1b..."
          className="w-full p-3 mb-6 rounded-xl bg-black border border-gray-600 focus:border-yellow-400 outline-none"
        />

        {/* ✅ Warning */}
        <p className="text-gray-400 text-sm mb-5 leading-relaxed">
          ⚠ بعد التحويل اكتب رقم العملية واضغط تأكيد الدفع  
          وسيقوم الأدمن بمراجعتها وتفعيل اشتراكك ✅
        </p>

        {/* ✅ Confirm Button */}
        <button
          onClick={confirmPayment}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg transition"
        >
          ✅ تأكيد الدفع وإرسال الطلب
        </button>

        {/* ✅ Back */}
        <button
          onClick={() => router.push("/packages")}
          className="w-full mt-4 border border-gray-500 text-white py-3 rounded-xl hover:border-yellow-400 transition"
        >
          ⬅ رجوع للباقات
        </button>
      </div>
    </div>
  );
}