"use client";

import { useRouter } from "next/navigation";

export default function PackagesPage() {
  const router = useRouter();

  const packages = [
    { id: 1, price: 80, profit: 1 },
    { id: 2, price: 150, profit: 3 },
    { id: 3, price: 300, profit: 6 },
    { id: 4, price: 500, profit: 8 },
    { id: 5, price: 1000, profit: 10 },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #050505, #111)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        fontFamily: "Tajawal, sans-serif",
      }}
    >
      <div style={{ width: "420px" }}>
        {/* ✅ العنوان */}
        <h2
          style={{
            textAlign: "center",
            color: "gold",
            fontSize: "26px",
            marginBottom: "25px",
          }}
        >
          💎 باقات الاستثمار - Charge Wealth
        </h2>

        {/* ✅ عرض الباقات */}
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            style={{
              background: "#141414",
              border: "2px solid gold",
              borderRadius: "18px",
              padding: "18px",
              marginBottom: "18px",
              boxShadow: "0px 0px 12px rgba(255,215,0,0.25)",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "10px" }}>
              ⭐ الباقة رقم {pkg.id}
            </h3>

            <p style={{ color: "#ddd", margin: "6px 0" }}>
              💰 سعر الاشتراك:{" "}
              <span style={{ color: "gold", fontWeight: "bold" }}>
                {pkg.price}$ دولار
              </span>
            </p>

            <p style={{ color: "#ddd", margin: "6px 0" }}>
              📈 الربح اليومي:{" "}
              <span style={{ color: "#00ff99", fontWeight: "bold" }}>
                {pkg.profit}$ دولار
              </span>
            </p>

            {/* ✅ زر الاشتراك */}
            <button
              onClick={() => router.push(`/payment?package=${pkg.id}`)}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "12px",
                borderRadius: "12px",
                background: "gold",
                color: "black",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✅ اشتراك الآن
            </button>
          </div>
        ))}

        {/* ✅ رجوع للداشبورد */}
        <button
          onClick={() => router.push("/dashboard")}
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid gray",
            background: "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          ⬅ رجوع للداشبورد
        </button>
      </div>
    </div>
  );
}