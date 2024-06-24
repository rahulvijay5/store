import { formatNumber } from "@/actions/orderActions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypeOfInsights } from "@/lib/types";
import { Loader2Icon } from "lucide-react";

import { useEffect, useState } from "react";

export default function Insights() {
  const [insights,setInsights] = useState<TypeOfInsights>();

  const GetInsights = async () => {
    const response = await fetch(
      `/api/get-insights`,
      {
        method: "GET",
      }
    );
    const res = await response.json();
    if (res.status == 200) {
      setInsights(res.message)
    }
  };
  useEffect(() => {
    console.log("useEffect triggered on order history page");
    GetInsights();
  }, []);

  return (
    <div className="border-0 mb-6 md:flex md:items-center w-full gap-4">
      {insights? (<>
      <Card className="flex pb-4 mb-2 w-full">
        <CardHeader className="pb-2 w-1/2">
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-3xl">{formatNumber(insights.thisWeeksSales.totalPrice)}₹</CardTitle>
        </CardHeader>
        <CardHeader className="pb-2 w-1/2">
          <CardDescription>This Month</CardDescription>
          <CardTitle className="text-3xl">{formatNumber(insights.thisMonthsSales.totalPrice)}₹</CardTitle>
        </CardHeader>
      </Card>
      <Card className="flex pb-4 w-full">
        <CardHeader className="pb-2 w-1/2">
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-3xl">{formatNumber(insights.thisWeeksSales.totalWeight)}kg</CardTitle>
        </CardHeader>
        <CardHeader className="pb-2 w-1/2">
          <CardDescription>This Month</CardDescription>
          <CardTitle className="text-3xl">{formatNumber(insights.thisMonthsSales.totalWeight)}kg</CardTitle>
        </CardHeader>
      </Card>
      </>
      ):<div className="flex items-center justify-center text-wrap gap-2"><span className="animate-spin"><Loader2Icon/></span>Getting insights for you...</div>}
    </div>
  );
}
