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
        <MenuItem
          title="🏦 طلبات السحب"
          onClick={() => setTab("withdrawals")}
        />
        <MenuItem title="👥 إدارة المستخدمين" onClick={() => setTab("users")} />
        <MenuItem title="📦 الباقات" onClick={() => setTab("plans")} />
        <MenuItem title="⚙️ إعدادات الأدمن" onClick={() => setTab("settings")} />
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

function MenuItem({ title, onClick }: { title: string; onClick: () => void }) {
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
    plans: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const paymentsSnap = await getDocs(collection(db, "payments"));
      const withdrawSnap = await getDocs(collection(db, "withdrawRequests"));
      const plansSnap = await getDocs(collection(db, "plans"));

      setStats({
        users: usersSnap.size,
        pendingPayments: paymentsSnap.docs.filter(
          (d) => d.data().status === "pending"
        ).length,
        pendingWithdraws: withdrawSnap.docs.filter(
          (d) => d.data().status === "pending"
        ).length,
        plans: plansSnap.size,
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">📊 الإحصائيات العامة</h1>

      <div className="grid grid-cols-2 gap-6">
        <StatCard title="👥 عدد المستخدمين" value={stats.users} />
        <StatCard title="💰 إيداعات معلقة" value={stats.pendingPayments} />
        <StatCard title="🏦 سحوبات معلقة" value={stats.pendingWithdraws} />
        <StatCard title="📦 عدد الباقات" value={stats.plans} />
      </div>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-[#020617] border border-yellow-500 rounded-xl p-6">
      <p className="text-gray-400 text-lg mb-2">{title}</p>
      <p className="text-4xl font-bold text-yellow-400">{value}</p>
    </div>
  );
}

/* ================== PAYMENTS ================== */

function Payments() {
  const [payments, setPayments] = useState<any[]>([]);

  const fetchPayments = async () => {
    const snap = await getDocs(collection(db, "payments"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setPayments(data.filter((p: any) => p.status === "pending"));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ الموافقة الصحيحة
  const approvePayment = async (p: any) => {
    // ✅ تحديث حالة الإيداع
    await updateDoc(doc(db, "payments", p.id), {
      status: "approved",
    });

    // ✅ إضافة الرصيد للمستخدم
    await updateDoc(doc(db, "users", p.userId), {
      balance: increment(p.amount),
    });

    // ✅ حفظ الباقة للمستخدم
    await updateDoc(doc(db, "users", p.userId), {
      packageId: p.packageId || 1,
    });

    alert("✅ تم قبول الإيداع وتفعيل الباقة بنجاح");

    fetchPayments();
  };

  const rejectPayment = async (id: string) => {
    await updateDoc(doc(db, "payments", id), { status: "rejected" });
    alert("❌ تم رفض الإيداع");
    fetchPayments();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">💰 طلبات الإيداع</h1>

      {payments.length === 0 && (
        <p className="text-gray-400">✅ لا توجد طلبات إيداع</p>
      )}

      {payments.map((p) => (
        <RequestBox
          key={p.id}
          title={`👤 المستخدم: ${p.userId}`}
          amount={`💵 المبلغ: ${p.amount}$`}
          onApprove={() => approvePayment(p)}
          onReject={() => rejectPayment(p.id)}
        />
      ))}
    </div>
  );
}

/* ================== WITHDRAWALS ================== */

function Withdrawals() {
  const [withdraws, setWithdraws] = useState<any[]>([]);

  const fetchWithdraws = async () => {
    const snap = await getDocs(collection(db, "withdrawRequests"));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setWithdraws(data.filter((w: any) => w.status === "pending"));
  };

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const approveWithdraw = async (w: any) => {
    await updateDoc(doc(db, "withdrawRequests", w.id), {
      status: "approved",
    });

    await updateDoc(doc(db, "users", w.userId), {
      balance: increment(-w.amount),
    });

    alert("✅ تم قبول السحب وخصم الرصيد");
    fetchWithdraws();
  };

  const rejectWithdraw = async (id: string) => {
    await updateDoc(doc(db, "withdrawRequests", id), {
      status: "rejected",
    });

    alert("❌ تم رفض السحب");
    fetchWithdraws();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🏦 طلبات السحب</h1>

      {withdraws.length === 0 && (
        <p className="text-gray-400">✅ لا توجد طلبات سحب</p>
      )}

      {withdraws.map((w) => (
        <RequestBox
          key={w.id}
          title={`👤 المستخدم: ${w.userId}`}
          amount={`💵 المبلغ: ${w.amount}$`}
          extra={`📌 المحفظة: ${w.wallet}`}
          onApprove={() => approveWithdraw(w)}
          onReject={() => rejectWithdraw(w.id)}
        />
      ))}
    </div>
  );
}

/* ================== USERS ================== */

function Users() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">👥 إدارة المستخدمين</h1>
      <p className="text-gray-400">✅ موجودة عندك بالفعل</p>
    </div>
  );
}

/* ================== PLANS ================== */

function Plans() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📦 إدارة الباقات</h1>
      <p className="text-gray-400">✅ الباقات شغالة عندك بالفعل</p>
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
    alert("✅ تم حفظ الإعدادات");
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
        className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold"
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
          ✔ موافقة
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