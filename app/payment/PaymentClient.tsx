"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { auth, db } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const packageId = searchParams.get("package");

  const packages: any = {
    1: { price: 80, profit: 1 },
    2: { price: 150, profit: 3 },
    3: { price: 300, profit: 6 },
    4: { price: 500, profit: 8 },
    5: { price: 1000, profit: 10 },
  };

  const selectedPackage = packages[packageId || "1"];

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });

    return () => unsub();
  }, []);

  const walletAddress = "TWa3Jc6572z52K1EkLReXJUEFF11a8C7jT";

  const confirmPayment = async () => {
    if (!userId) return alert("❌ لازم تسجل دخول الأول");

    await addDoc(collection(db, "payments"), {
      userId,
      amount: selectedPackage.price,
      packageId: Number(packageId),
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("✅ تم إرسال طلب الإيداع للإدارة");

    router.push("/dashboard");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex justify-center items-center bg-[#0b1220] text-white p-6"
    >
      <div className="w-full max-w-md bg-[#020617] border border-yellow-500 rounded-3xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">
          💳 الدفع عبر USDT
        </h1>

        <div className="bg-black/40 border border-yellow-500 rounded-xl p-4 mb-6">
          <p className="mb-2">
            ⭐ الباقة المختارة:
            <span className="text-yellow-400 font-bold"> #{packageId}</span>
          </p>

          <p className="mb-2">
            💰 السعر:
            <span className="text-yellow-400 font-bold">
              {" "}
              {selectedPackage.price}$ USDT
            </span>
          </p>

          <p>
            📈 الربح اليومي:
            <span className="text-green-400 font-bold">
              {" "}
              {selectedPackage.profit}$ يومياً
            </span>
          </p>
        </div>

        <h2 className="text-lg mb-2">✅ أرسل المبلغ إلى المحفظة:</h2>

        <div className="bg-black border border-yellow-500 rounded-xl p-4 text-yellow-400 font-bold text-sm text-center break-words mb-5">
          {walletAddress}
        </div>

        <button
          onClick={confirmPayment}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 rounded-xl font-bold text-lg transition"
        >
          ✅ تأكيد الدفع وإرسال الطلب
        </button>

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