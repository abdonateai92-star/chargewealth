"use client";

import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        phone,
        email,
        balance: 0,
        role: "user",
        createdAt: new Date(),
      });

      alert("✅ تم إنشاء الحساب بنجاح");
      router.push("/login");
    } catch (err: any) {
      setError("❌ " + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ Logo */}
        <img src="/logo.png" alt="Charge Wealth" style={styles.logo} />

        <h1 style={styles.brand}>Charge Wealth</h1>
        <p style={styles.subtitle}>إنشاء حساب جديد</p>

        {/* ✅ Form */}
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            style={styles.input}
            placeholder="اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="كلمة المرور (6 أحرف)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} disabled={loading}>
            {loading ? "جاري التسجيل..." : "إنشاء حساب"}
          </button>
        </form>

        {/* ✅ Terms */}
        <p style={styles.terms}>
          بالتسجيل أنت توافق على شروط وسياسة منصة Charge Wealth.
        </p>

        {/* ✅ Link */}
        <p style={styles.linkText}>
          لديك حساب بالفعل؟{" "}
          <span style={styles.link} onClick={() => router.push("/login")}>
            تسجيل الدخول
          </span>
        </p>
      </div>
    </div>
  );
}

/* ✅ VIP Gold & Black Theme */
const styles: any = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle, #000000, #111111)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Tahoma",
  },

  card: {
    width: "420px",
    background: "#0d0d0d",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    border: "1px solid #d4af37",
    boxShadow: "0 0 25px rgba(212,175,55,0.4)",
  },

  logo: {
    width: "90px",
    marginBottom: "12px",
  },

  brand: {
    color: "#d4af37",
    fontSize: "28px",
    marginBottom: "5px",
    fontWeight: "bold",
  },

  subtitle: {
    color: "#eee",
    marginBottom: "25px",
    fontSize: "14px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #333",
    background: "#000",
    color: "white",
    fontSize: "15px",
    outline: "none",
    textAlign: "right",
  },

  button: {
    padding: "12px",
    marginTop: "10px",
    borderRadius: "12px",
    border: "none",
    background: "#d4af37",
    color: "black",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "13px",
  },

  terms: {
    marginTop: "20px",
    color: "#aaa",
    fontSize: "12px",
  },

  linkText: {
    marginTop: "15px",
    color: "white",
    fontSize: "14px",
  },

  link: {
    color: "#d4af37",
    cursor: "pointer",
    fontWeight: "bold",
  },
};