import { Suspense } from "react";
import DepositClient from "./DepositClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DepositClient />
    </Suspense>
  );
}