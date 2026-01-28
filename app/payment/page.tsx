import { Suspense } from "react";
import PaymentClient from "./PaymentClient";

export const dynamic = "force-dynamic";

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">جار التحميل...</div>}>
      <PaymentClient />
    </Suspense>
  );
}