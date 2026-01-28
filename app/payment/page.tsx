"use client";

export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";

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

  const selectedPackage = packages[packageId || 1];

  // ✅ عنوان محفظة الإدارة الرسمي
  const walletAddress = "TWa3Jc6572z52K1EkLReXJUEFF11a8C7jT";

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
      <div
        style={{
          width: "420px",
          background: "#141414",
          border: "2px solid gold",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0px 0px 18px rgba(255,215,0,0.35)",
        }}
      >
        {/* ✅ Title */}
        <h2
          style={{
            textAlign: "center",
            color: "gold",
            marginBottom: "20px",
            fontSize: "22px",
          }}
        >
          💳 الدفع عبر USDT TRC20
        </h2>

        {/* ✅ Package Details */}
        <div
          style={{
            background: "#0d0d0d",
            padding: "15px",
            borderRadius: "15px",
            border: "1px solid #333",
            marginBottom: "20px",
          }}
        >
          <p style={{ color: "white", margin: "6px 0" }}>
            ⭐ الباقة المختارة:{" "}
            <span style={{ color: "gold", fontWeight: "bold" }}>
              #{packageId}
            </span>
          </p>

          <p style={{ color: "white", margin: "6px 0" }}>
            💰 سعر الاشتراك:{" "}
            <span style={{ color: "gold", fontWeight: "bold" }}>
              {selectedPackage.price}$ USDT
            </span>
          </p>

          <p style={{ color: "white", margin: "6px 0" }}>
            📈 الربح اليومي:{" "}
            <span style={{ color: "#00ff99", fontWeight: "bold" }}>
              {selectedPackage.profit}$ يومياً
            </span>
          </p>
        </div>

        {/* ✅ Wallet */}
        <h3 style={{ color: "white", marginBottom: "10px", fontSize: "15px" }}>
          ✅ أرسل المبلغ إلى عنوان المحفظة التالي:
        </h3>

        <div
          style={{
            background: "#000",
            padding: "15px",
            borderRadius: "12px",
            border: "1px solid gold",
            color: "gold",
            fontSize: "14px",
            wordBreak: "break-word",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {walletAddress}
        </div>

        {/* ✅ Warning */}
        <p style={{ color: "#ccc", fontSize: "13px", marginBottom: "15px" }}>
          ⚠ بعد التحويل اضغط على زر{" "}
          <span style={{ color: "gold" }}>تأكيد الدفع</span> وسيتم مراجعة
          العملية من الإدارة وتفعيل اشتراكك خلال وقت قصير.
        </p>

        {/* ✅ Confirm Button */}
        <button
          onClick={() =>
            alert("✅ تم إرسال طلب الدفع للإدارة بنجاح! سيتم التفعيل قريباً.")
          }
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "12px",
            background: "gold",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ✅ تأكيد الدفع
        </button>

        {/* ✅ Back */}
        <button
          onClick={() => router.push("/packages")}
          style={{
            marginTop: "12px",
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            background: "transparent",
            border: "1px solid gray",
            color: "white",
            cursor: "pointer",
          }}
        >
          ⬅ رجوع للباقات
        </button>
      </div>
    </div>
  );
}