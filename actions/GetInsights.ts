import { prun } from "@/lib/prisma";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";

export async function GetInsights() {
  const now = new Date();
  const startOfCurrentWeek = startOfWeek(now);
  const endOfCurrentWeek = endOfWeek(now);
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);

  try {
    // This week's sales
    const thisWeeksSales = await prun.order.aggregate({
      _sum: {
        totalPrice: true,
        totalWeight: true,
      },
      where: {
        createdAt: {
          gte: startOfCurrentWeek,
          lte: endOfCurrentWeek,
        },
      },
    });

    // This month's sales
    const thisMonthsSales = await prun.order.aggregate({
      _sum: {
        totalPrice: true,
        totalWeight: true,
      },
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
          lte: endOfCurrentMonth,
        },
      },
    });

    const insights = {
      thisWeeksSales: {
        totalPrice: thisWeeksSales._sum.totalPrice || 0,
        totalWeight: thisWeeksSales._sum.totalWeight || 0,
      },
      thisMonthsSales: {
        totalPrice: thisMonthsSales._sum.totalPrice || 0,
        totalWeight: thisMonthsSales._sum.totalWeight || 0,
      },
    };

    return insights
  } catch (error) {
    console.error("Error fetching sales insights:", error);
    throw error;
  }
}
