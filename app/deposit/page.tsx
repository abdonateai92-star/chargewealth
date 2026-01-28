"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebase";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(true);

  /* ✅ تحميل محفظة الأدمن من Firestore */
  useEffect(() => {
    const fetchWallet = async () => {
      const snap = await getDoc(doc(db, "settings", "admin"));

      if (snap.exists()) {
        const data: any = snap.data();
        setWalletAddress(data.wallet || "");
      }

      setLoading(false);
    };

    fetchWallet();
  }, []);

  /* ✅ إرسال طلب الإيداع للأدمن */
  const submitDeposit = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("❌ لازم تسجل دخول الأول");
      return;
    }

    if (!amount) {
      alert("❌ اكتب مبلغ الإيداع");
      return;
    }

    if (!walletAddress) {
      alert("❌ محفظة الإدارة غير موجودة");
      return;
    }

    await addDoc(collection(db, "payments"), {
      userId: user.uid,
      amount: Number(amount),
      status: "pending",
      createdAt: new Date(),
    });

    alert("✅ تم إرسال طلب الإيداع للأدمن بنجاح");

    setAmount("");
  };

  /* ✅ Loading */
  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 text-xl">
        ⏳ جاري تحميل بيانات الإيداع...
      </p>
    );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white flex justify-center items-center p-6"
    >
      <div className="w-full max-w-xl bg-[#020617] border border-yellow-500 rounded-3xl p-10 shadow-xl">
        
        {/* ✅ Title */}
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">
          💰 صفحة الإيداع
        </h1>

        {/* ✅ Admin Wallet */}
        <p className="text-gray-300 text-center mb-4">
          قم بتحويل المبلغ إلى محفظة الإدارة التالية:
        </p>

        <div className="bg-black border border-yellow-400 p-4 rounded-xl text-center mb-6 text-yellow-400 font-bold break-all">
          {walletAddress}
        </div>

        {/* ✅ Amount Input */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="💵 اكتب مبلغ الإيداع بالدولار"
          className="w-full p-4 rounded-xl bg-black border border-yellow-500 mb-6"
        />

        {/* ✅ Submit */}
        <button
          onClick={submitDeposit}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg transition"
        >
          ✅ تأكيد الإيداع
        </button>

        <p className="text-gray-400 text-sm mt-6 text-center">
          بعد التأكيد سيتم إرسال الطلب مباشرة إلى لوحة الأدمن للمراجعة.
        </p>
      </div>
    </div>
  );
}