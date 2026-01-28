"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ تسجيل الدخول
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // ✅ جلب بيانات المستخدم من Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        setError("هذا الحساب غير موجود في النظام.");
        setLoading(false);
        return;
      }

      const data = userDoc.data();

      // ✅ تحقق إنه Admin
      if (data.role !== "admin") {
        setError("❌ هذا الحساب ليس مديراً!");
        setLoading(false);
        return;
      }

      alert("✅ أهلاً بك يا مدير المنصة!");

      // ✅ تحويل إلى لوحة الأدمن
      router.push("/admin");
    } catch (err: any) {
      setError("❌ بيانات الدخول غير صحيحة");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 دخول الإدارة</h1>

        <form onSubmit={handleAdminLogin} style={styles.form}>
          <input
            placeholder="البريد الإلكتروني"
            type="email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            placeholder="كلمة المرور"
            type="password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button disabled={loading} style={styles.button}>
            {loading ? "جاري الدخول..." : "دخول الأدمن"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ✅ Styles ذهب + أسود */
const styles: any = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #000, #111)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Tajawal",
  },

  card: {
    width: "400px",
    background: "#111",
    padding: "30px",
    borderRadius: "16px",
    border: "2px solid gold",
    textAlign: "center",
    boxShadow: "0 0 20px rgba(255,215,0,0.3)",
  },

  title: {
    color: "gold",
    marginBottom: "20px",
    fontSize: "24px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #444",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "gold",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "14px",
  },
};