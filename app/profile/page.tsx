"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ تحميل بيانات المستخدم من Firestore
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        setUserData(snap.data());
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ✅ تسجيل خروج
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading)
    return (
      <p className="text-center text-gray-400 mt-20 text-xl">
        ⏳ جاري تحميل الحساب...
      </p>
    );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#0b1220] text-white flex justify-center items-center"
    >
      <div className="w-[95%] max-w-3xl bg-[#0f172a] rounded-3xl p-10 shadow-xl border border-yellow-500">

        {/* ✅ العنوان */}
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-10">
          👤 الحساب الشخصي
        </h1>

        {/* ✅ بيانات المستخدم */}
        <div className="space-y-6">

          <InfoCard
            title="📛 اسم المستخدم"
            value={userData?.username || "غير متوفر"}
          />

          <InfoCard
            title="📧 البريد الإلكتروني"
            value={userData?.email || "غير متوفر"}
          />

          <InfoCard
            title="📱 رقم الهاتف"
            value={userData?.phone || "غير متوفر"}
          />

          <InfoCard
            title="💰 الرصيد الحالي"
            value={`${userData?.balance || 0}$`}
            highlight
          />

          <InfoCard
            title="🎯 رمز الدعوة"
            value={userData?.inviteCode || "لا يوجد"}
          />
        </div>

        {/* ✅ أزرار التحكم */}
        <div className="grid grid-cols-2 gap-4 mt-10">

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-yellow-500 text-black py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 transition"
          >
            ⬅ العودة للداشبورد
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-red-500 transition"
          >
            🚪 تسجيل خروج
          </button>
        </div>
      </div>
    </div>
  );
}

/* ✅ Component Card */

function InfoCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#020617] border border-yellow-500 rounded-2xl p-5 flex justify-between items-center">
      <p className="text-gray-300 text-lg">{title}</p>

      <p
        className={`text-lg font-bold ${
          highlight ? "text-yellow-400 text-2xl" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}