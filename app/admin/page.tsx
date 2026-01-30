"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  increment,
  getDoc,
  setDoc,
  query,
  where,
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
        <MenuItem title="📦 إدارة الباقات" onClick={() => setTab("plans")} />
        <MenuItem title="⚙️ الإعدادات" onClick={() => setTab("settings")} />
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">
        {tab === "dashboard" && <Dashboard />}
        {tab === "payments" && <Payments />}
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
    plans: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const paySnap = await getDocs(collection(db, "payments"));
      const plansSnap = await getDocs(collection(db, "plans"));

      setStats({
        users: usersSnap.size,
        pendingPayments: paySnap.docs.filter(
          (d) => d.data().status === "pending"
        ).length,
        plans: plansSnap.size,
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📊 إحصائيات الأدمن</h1>

      <div className="grid grid-cols-3 gap-6">
        <StatCard title="👥 المستخدمين" value={stats.users} />
        <StatCard title="💰 إيداعات معلقة" value={stats.pendingPayments} />
        <StatCard title="📦 عدد الباقات" value={stats.plans} />
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

/* ================== PAYMENTS ================== */

function Payments() {
  const [payments, setPayments] = useState<any[]>([]);

  const fetchPayments = async () => {
    const snap = await getDocs(collection(db, "payments"));

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setPayments(data.filter((p: any) => p.status === "pending"));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const approvePayment = async (p: any) => {
    try {
      await updateDoc(doc(db, "payments", p.id), {
        status: "approved",
      });

      const snap = await getDocs(
        query(collection(db, "users"), where("userId", "==", p.userId))
      );

      if (snap.empty) return alert("❌ المستخدم غير موجود");

      const userDocId = snap.docs[0].id;

      await updateDoc(doc(db, "users", userDocId), {
        balance: increment(p.amount),
        packageId: p.packageId,
      });

      alert("✅ تم قبول الإيداع وتفعيل الباقة");

      fetchPayments();
    } catch (err) {
      console.log(err);
      alert("❌ حصل خطأ");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">💰 طلبات الإيداع</h1>

      {payments.length === 0 && (
        <p className="text-gray-400">✅ لا توجد طلبات معلقة</p>
      )}

      {payments.map((p) => (
        <RequestBox
          key={p.id}
          title={`👤 المستخدم: ${p.userId}`}
          amount={`💵 المبلغ: ${p.amount}$`}
          extra={`📦 الباقة: ${p.packageId}`}
          onApprove={() => approvePayment(p)}
        />
      ))}
    </div>
  );
}

/* ================== PLANS (إدارة الباقات) ================== */

function Plans() {
  const [plans, setPlans] = useState<any[]>([]);

  // ✅ Inputs
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [profit, setProfit] = useState("");

  // ✅ تحميل الباقات
  const fetchPlans = async () => {
    const snap = await getDocs(collection(db, "plans"));

    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setPlans(data);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ✅ إضافة باقة جديدة
  const addPlan = async () => {
    if (!name || !price || !profit)
      return alert("❌ أدخل اسم الباقة + السعر + الربح");

    await addDoc(collection(db, "plans"), {
      name: name,
      price: Number(price),
      dailyProfit: Number(profit),
      active: true,
      createdAt: new Date(),
    });

    setName("");
    setPrice("");
    setProfit("");

    alert("✅ تمت إضافة الباقة بنجاح");
    fetchPlans();
  };

  // ✅ حذف باقة
  const deletePlan = async (id: string) => {
    await deleteDoc(doc(db, "plans", id));
    alert("✅ تم حذف الباقة");
    fetchPlans();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📦 إدارة الباقات</h1>

      {/* ✅ إضافة باقة */}
      <div className="bg-black p-6 rounded-xl border border-yellow-500 mb-6 space-y-3">
        {/* اسم الباقة */}
        <input
          placeholder="اسم الباقة"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-[#111] border border-yellow-500"
        />

        {/* السعر */}
        <input
          placeholder="السعر بالدولار"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          className="w-full p-3 rounded bg-[#111] border border-yellow-500"
        />

        {/* الربح اليومي */}
        <input
          placeholder="الربح اليومي بالدولار"
          value={profit}
          onChange={(e) => setProfit(e.target.value)}
          type="number"
          className="w-full p-3 rounded bg-[#111] border border-yellow-500"
        />

        {/* زر إضافة */}
        <button
          onClick={addPlan}
          className="w-full bg-yellow-500 text-black py-3 rounded font-bold hover:bg-yellow-400 transition"
        >
          ➕ إضافة باقة جديدة
        </button>
      </div>

      {/* ✅ عرض الباقات */}
      {plans.length === 0 && (
        <p className="text-gray-400">⚠️ لا توجد باقات حالياً</p>
      )}

      {plans.map((p) => (
        <div
          key={p.id}
          className="bg-[#020617] border border-yellow-500 rounded-xl p-5 mb-3 flex justify-between items-center"
        >
          <div>
            <p className="text-xl font-bold text-yellow-400">
              {p.name}
            </p>

            <p className="text-gray-300">
              💰 السعر: {p.price}$
            </p>

            <p className="text-green-400 font-bold">
              📈 الربح اليومي: {p.dailyProfit}$
            </p>
          </div>

          <button
            onClick={() => deletePlan(p.id)}
            className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-500 transition"
          >
            🗑 حذف
          </button>
        </div>
      ))}
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
      <h1 className="text-3xl font-bold mb-6">⚙️ الإعدادات</h1>

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

function RequestBox({ title, amount, extra, onApprove }: any) {
  return (
    <div className="bg-[#020617] border border-yellow-500 rounded-xl p-6 mb-4 flex justify-between items-center">
      <div>
        <p>{title}</p>
        <p className="text-yellow-400">{amount}</p>
        {extra && <p className="text-gray-400">{extra}</p>}
      </div>

      <button
        onClick={onApprove}
        className="bg-green-500 text-black px-5 py-2 rounded-lg font-bold"
      >
        ✔ قبول
      </button>
    </div>
  );
}