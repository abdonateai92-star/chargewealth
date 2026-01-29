import dynamic from "next/dynamic";

const DepositPage = dynamic(() => import("./DepositClient"), {
  ssr: false,
});

export default DepositPage;