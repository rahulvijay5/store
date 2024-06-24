import { prun } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId: number | null = Number(searchParams.get("userId"));
  console.log(userId);
  try {
    const orders = await prun.order.findMany({
      take: 5,
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(orders);
    return NextResponse.json({ message: orders, status: 200 });
  } catch (error) {
    console.error("Error finding the user: ", error);
    throw error;
  }
}
// }
