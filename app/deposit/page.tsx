"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  addDoc,
  collection,
  getDoc,
  doc,
} from "firebase/firestore";

export default function DepositPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ الباقة اللي جاية من الرابط
  const packageId = searchParams.get("package");

  const [user, setUser] = useState<any>(null);

  const [amount, setAmount] = useState("");
  const [txid, setTxid] = useState("");

  const [adminWallet, setAdminWallet] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ بيانات الباقة المختارة
  const [plan, setPlan] = useState<any>(null);

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

  /* ✅ تحميل بيانات الباقة */
  useEffect(() => {
    const fetchPlan = async () => {
      if (!packageId) return;

      const snap = await getDoc(doc(db, "plans", packageId));
      if (snap.exists()) {
        setPlan({ id: snap.id, ...snap.data() });

        // ✅ يحط السعر تلقائي
        setAmount((snap.data() as any).price);
      }
    };

    fetchPlan();
  }, [packageId]);

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
      return alert("❌ لازم تدخل رقم العملية TxID");

    if (!packageId)
      return alert("❌ لازم تختار باقة من صفحة الباقات");

    setLoading(true);

    try {
      /* ✅ حفظ الطلب في Firestore */
      await addDoc(collection(db, "payments"), {
        userId: user.uid,
        email: user.email,

        amount: Number(amount),
        txid,

        // ✅ حفظ الباقة
        packageId: packageId,

        status: "pending",
        createdAt: new Date(),
      });

      alert("✅ تم إرسال طلب الإيداع للإدارة بنجاح");

      setTxid("");
    } catch (err) {
      alert("❌ حصل خطأ أثناء إرسال الطلب");
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

        {/* ✅ عرض الباقة */}
        {plan && (
          <div className="bg-black border border-yellow-500 rounded-xl p-4 mb-6">
            <p className="text-gray-300">
              📦 الباقة المختارة:
              <span className="text-yellow-400 font-bold">
                {" "} {plan.price}$ 
              </span>
            </p>

            <p className="text-gray-300 mt-2">
              📈 الربح اليومي:
              <span className="text-green-400 font-bold">
                {" "} {plan.dailyProfit}$ يومياً
              </span>
            </p>
          </div>
        )}

        {/* ✅ محفظة الأدمن */}
        <div className="bg-black border border-yellow-400 rounded-xl p-4 mb-6 text-center">
          <p className="text-gray-300 mb-2">
            ✅ ابعت الفلوس على المحفظة دي:
          </p>

          <p className="text-yellow-400 font-bold break-all">
            {adminWallet}
          </p>
        </div>

        {/* ✅ مبلغ الإيداع */}
        <input
          type="number"
          value={amount}
          disabled
          className="w-full p-4 rounded-xl bg-gray-900 border border-yellow-500 mb-4 text-yellow-300 font-bold"
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
          className="w-full bg-yellow-500 text-black py-4 rounded-xl font-bold"
        >
          {loading ? "⏳ جاري الإرسال..." : "✅ إرسال طلب الإيداع"}
        </button>
      </div>
    </div>
  );
}