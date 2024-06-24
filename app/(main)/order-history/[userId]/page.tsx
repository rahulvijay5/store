import OrderHistory from "@/components/OrderHistory";
import React, { Suspense } from "react";
import Loading from "./loading";

const orderHistoryPage = ({ params }: { params: { userId: number } }) => {
  const userId = params.userId;
  return (
    <div className="px-2">
      <Suspense fallback={<Loading />}>
        <OrderHistory userId={userId} />
      </Suspense>
    </div>
  );
};

export default orderHistoryPage;
