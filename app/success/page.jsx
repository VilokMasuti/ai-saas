import { Suspense } from "react";
import SuccessClient from "./SuccessClient";


export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
