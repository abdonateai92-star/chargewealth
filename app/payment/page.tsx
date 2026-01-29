"use client";

import { Suspense } from "react";
import PaymentContent from "./PaymentContent";

export default function PaymentPage() {
  return (
    <Suspense fallback={<p className="text-white text-center">⏳ تحميل...</p>}>
      <PaymentContent />
    </Suspense>
  );
}