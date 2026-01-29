"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { addDoc, collection, getDoc, doc, serverTimestamp } from "firebase/firestore";

export default function DepositPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [amount, setAmount] = useState("");
  const [txid, setTxid] = useState("");

  const [adminWallet, setAdminWallet] = useState("");
  const [loading, setLoading] = useState(false);

  /* ✅ تحميل محفظة الأدمن */
  useEffect(() => {
    const fetchWallet = async () => {
      const snap = await getDoc(doc(db, "settings", "admin"));
      if (snap.exists()) {
        setAdminWallet((snap.data() as any).wallet);
      }
    };

    fetchWallet();
  }, []);

  /* ✅ تحميل المستخدم */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else setUser(u);
    });

    return () => unsub();
  }, []);

  /* ✅ إرسال طلب الإيداع */
  const submitDeposit = async () => {
    if (!amount || !txid)
      return alert("❌ لازم تدخل المبلغ + رقم العملية TxID");

    setLoading(true);

    try {
      await addDoc(collection(db, "payments"), {
        userId: user.uid,
        email: user.email,
        amount: Number(amount),
        txid,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("✅ تم إرسال طلب الإيداع للإدارة بنجاح");

      setAmount("");
      setTxid("");
    } catch (err) {
      alert("❌ حصل خطأ أثناء الإرسال");
    }

    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white flex justify-center items-center p-6"
    >
      <div className="w-full max-w-xl bg-[#020617] border border-yellow-500 rounded-3xl p-10">

        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">
          💰 صفحة الإيداع
        </h1>

        {/* ✅ محفظة الأدمن */}
        <div className="bg-black border border-yellow-400 rounded-xl p-4 mb-6 text-center">
          <p className="text-gray-300 mb-2">✅ ابعت الفلوس على المحفظة دي:</p>

          <p className="text-yellow-400 font-bold break-all">
            {adminWallet || "جارٍ التحميل..."}
          </p>
        </div>

        {/* ✅ مبلغ الإيداع */}
        <input
          type="number"
          placeholder="💵 مبلغ الإيداع بالدولار"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-4 rounded-xl bg-black border border-yellow-500 mb-4"
        />

        {/* ✅ رقم العملية */}
        <input
          placeholder="🔑 رقم العملية TxID"
          value={txid}
          onChange={(e) => setTxid(e.target.value)}
          className="w-full p-4 rounded-xl bg-black border border-yellow-500 mb-6"
        />

        {/* ✅ إرسال */}
        <button
          disabled={loading}
          onClick={submitDeposit}
          className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition"
        >
          {loading ? "⏳ جاري الإرسال..." : "✅ إرسال طلب الإيداع"}
        </button>

      </div>
    </div>
  );
}