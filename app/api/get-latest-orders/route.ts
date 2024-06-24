import { allowedMails } from "@/lib/constants";
import { prun } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mail: string | null = searchParams.get("mailToCheck");
  const take: number | null = Number(searchParams.get("take"));
  if (mail) {
    if (allowedMails.includes(mail)) {
      try {
        const orders = await prun.order.findMany({
          take:take,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: true
          }
        });
        // console.log(orders);
        return NextResponse.json({ message: orders, status: 200 });
      } catch (error) {
        console.error("Error finding the user: ", error);
        throw error;
      }
    } else {
      return NextResponse.json({ message: "Unauthorised", status: 401 });
    }
  }else{
    return NextResponse.json({message:"No mail in url passed.",status:404})
  }
}
// }
