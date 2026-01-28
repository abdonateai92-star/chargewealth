"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  increment,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase";

/* ================== ADMIN PAGE ================== */

type Tab =
  | "dashboard"
  | "payments"
  | "withdrawals"
  | "users"
  | "plans"
  | "settings";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div dir="rtl" className="min-h-screen bg-[#0b1220] text-white flex text-lg">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] border-l border-yellow-500 p-6">
        <h2 className="text-2xl font-bold text-yellow-400 mb-8">
          ⚡ لوحة تحكم Charge Wealth
        </h2>

        <MenuItem title="📊 الرئيسية" onClick={() => setTab("dashboard")} />
        <MenuItem title="💰 طلبات الإيداع" onClick={() => setTab("payments")} />
        <MenuItem title="🏦 طلبات السحب" onClick={() => setTab("withdrawals")} />
        <MenuItem title="👥 المستخدمين" onClick={() => setTab("users")} />
        <MenuItem title="📦 الباقات" onClick={() => setTab("plans")} />
        <MenuItem title="⚙️ الإعدادات" onClick={() => setTab("settings")} />
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">
        {tab === "dashboard" && <Dashboard />}
        {tab === "payments" && <Payments />}
        {tab === "withdrawals" && <Withdrawals />}
        {tab === "users" && <Users />}
        {tab === "plans" && <Plans />}
        {tab === "settings" && <AdminSettings />}
      </main>
    </div>
  );
}

/* ================== UI ================== */

function MenuItem({ title, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full text-right mb-4 px-4 py-3 rounded
      bg-[#020617] hover:bg-yellow-500 hover:text-black transition font-semibold"
    >
      {title}
    </button>
  );
}

/* ================== DASHBOARD ================== */

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    pendingPayments: 0,
    pendingWithdraws: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const paySnap = await getDocs(collection(db, "payments"));
      const withSnap = await getDocs(collection(db, "withdrawRequests"));

      setStats({
        users: usersSnap.size,
        pendingPayments: paySnap.docs.filter(
          (d) => d.data().status === "pending"
        ).length,
        pendingWithdraws: withSnap.docs.filter(
          (d) => d.data().status === "pending"
        ).length,
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📊 إحصائيات الأدمن</h1>

      <div className="grid grid-cols-2 gap-6">
        <StatCard title="👥 عدد المستخدمين" value={stats.users} />
        <StatCard title="💰 إيداعات معلقة" value={stats.pendingPayments} />
        <StatCard title="🏦 سحوبات معلقة" value={stats.pendingWithdraws} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-[#020617] border border-yellow-500 rounded-xl p-6">
      <p className="text-gray-400 mb-2">{title}</p>
      <p className="text-4xl font-bold text-yellow-400">{value}</p>
    </div>
  );
}

/* ================== PAYMENTS (طلبات الإيداع) ================== */

function Payments() {
  const [payments, setPayments] = useState<any[]>([]);

  // ✅ تحميل طلبات الإيداع
  const fetchPayments = async () => {
    const snap = await getDocs(collection(db, "payments"));

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // ✅ فقط الطلبات pending
    setPayments(data.filter((p: any) => p.status === "pending"));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ قبول الإيداع
  const approvePayment = async (p: any) => {
    // تحديث حالة الطلب
    await updateDoc(doc(db, "payments", p.id), {
      status: "approved",
    });

    // إضافة الرصيد + حفظ الباقة
    await updateDoc(doc(db, "users", p.userId), {
      balance: increment(p.amount),
      packageId: p.packageId || 1,
    });

    alert("✅ تم قبول الإيداع وشحن الرصيد");

    fetchPayments();
  };

  // ✅ رفض الإيداع
  const rejectPayment = async (id: string) => {
    await updateDoc(doc(db, "payments", id), {
      status: "rejected",
    });

    alert("❌ تم رفض الإيداع");

    fetchPayments();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">💰 طلبات الإيداع</h1>

      {payments.length === 0 && (
        <p className="text-gray-400">✅ لا توجد طلبات حالياً</p>
      )}

      {payments.map((p) => (
        <RequestBox
          key={p.id}
          title={`👤 المستخدم: ${p.userId}`}
          amount={`💵 المبلغ: ${p.amount}$`}
          extra={`📦 الباقة: ${p.packageId}`}
          onApprove={() => approvePayment(p)}
          onReject={() => rejectPayment(p.id)}
        />
      ))}
    </div>
  );
}

/* ================== WITHDRAWALS ================== */

function Withdrawals() {
  return (
    <div>
      <h1 className="text-3xl font-bold">🏦 طلبات السحب</h1>
      <p className="text-gray-400 mt-4">✅ موجودة عندك لاحقًا</p>
    </div>
  );
}

/* ================== USERS ================== */

function Users() {
  return (
    <div>
      <h1 className="text-3xl font-bold">👥 المستخدمين</h1>
      <p className="text-gray-400 mt-4">✅ موجودة لاحقًا</p>
    </div>
  );
}

/* ================== PLANS ================== */

function Plans() {
  return (
    <div>
      <h1 className="text-3xl font-bold">📦 الباقات</h1>
      <p className="text-gray-400 mt-4">✅ جاهزة عندك</p>
    </div>
  );
}

/* ================== SETTINGS ================== */

function AdminSettings() {
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    getDoc(doc(db, "settings", "admin")).then((snap) => {
      if (snap.exists()) setWallet((snap.data() as any).wallet);
    });
  }, []);

  const save = async () => {
    await setDoc(doc(db, "settings", "admin"), { wallet }, { merge: true });
    alert("✅ تم حفظ المحفظة");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">⚙️ إعدادات الأدمن</h1>

      <input
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        placeholder="محفظة الأدمن"
        className="w-full max-w-xl p-3 rounded bg-black border border-yellow-500 mb-4"
      />

      <button
        onClick={save}
        className="bg-yellow-500 text-black px-6 py-3 rounded font-bold"
      >
        💾 حفظ
      </button>
    </div>
  );
}

/* ================== REQUEST BOX ================== */

function RequestBox({ title, amount, extra, onApprove, onReject }: any) {
  return (
    <div className="bg-[#020617] border border-yellow-500 rounded-xl p-6 mb-4 flex justify-between items-center">
      <div>
        <p>{title}</p>
        <p className="text-yellow-400">{amount}</p>
        {extra && <p className="text-gray-400">{extra}</p>}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onApprove}
          className="bg-green-500 text-black px-5 py-2 rounded-lg font-bold"
        >
          ✔ قبول
        </button>

        <button
          onClick={onReject}
          className="bg-red-600 text-white px-5 py-2 rounded-lg font-bold"
        >
          ✖ رفض
        </button>
      </div>
    </div>
  );
}