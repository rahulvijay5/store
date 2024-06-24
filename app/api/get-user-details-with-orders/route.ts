import { prun } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import {
  subMonths,
  subYears,
  startOfMonth,
  startOfYear,
  endOfMonth,
  endOfYear,
} from "date-fns";
import { currentUser, useAuth } from "@clerk/nextjs";
import { allowedMails } from "@/lib/constants";
import { newDate } from "react-datepicker/dist/date_utils";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = Number(searchParams.get("userId"));

  console.log("i am hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");

  if (isNaN(userId)) {
    return NextResponse.json({ message: "Invalid user ID", status: 400 });
  }

  const loggedInUser = await currentUser();
  const loggedInUserMail = loggedInUser?.emailAddresses[0].emailAddress;
  if (loggedInUserMail && allowedMails.includes(loggedInUserMail)) {
    try {
      const userDetails = await prun.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          orders: {
            orderBy: {
              createdAt: "desc",
            },
            take: 6,
            select: {
              id: true,
              totalPrice: true,
              totalWeight: true,
              pickupDate: true,
              createdAt: true,
              updatedAt: true,
              Reg250: true,
              Reg500: true,
              Reg1000: true,
              Sup250: true,
              Sup500: true,
              Sup1000: true,
            },
          },
        },
      });

      // console.log(userDetails)
      if (!userDetails) {
        return NextResponse.json({ message: "User not found", status: 404 });
      }

      const startOfThisMonth = startOfMonth(new Date());
      const endOfThisMonth = endOfMonth(new Date());

      const startOfThisYear = startOfYear(new Date());
      const endOfThisYear = endOfYear(new Date());

      const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
      const endOfLastMonth = endOfMonth(subMonths(new Date(), 1));

      const startOfLastYear = startOfYear(subYears(new Date(), 1));
      const endOfLastYear = endOfYear(subYears(new Date(), 1));

      // Fetch total orders for the last month

      const totalThisMonth = await prun.order.aggregate({
        _sum: {
          totalPrice: true,
          totalWeight: true,
        },
        where: {
          userId: userId,
          createdAt: {
            gte: startOfThisMonth,
            lte: endOfThisMonth,
          },
        },
      });

      const totalThisYear = await prun.order.aggregate({
        _sum: {
          totalPrice: true,
          totalWeight: true,
        },
        where: {
          userId: userId,
          createdAt: {
            gte: startOfThisMonth,
            lte: endOfThisMonth,
          },
        },
      });

      const totalLastMonth = await prun.order.aggregate({
        _sum: {
          totalPrice: true,
          totalWeight: true,
        },
        where: {
          userId: userId,
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      });

      // console.log("Total Last month: ", totalLastMonth)

      // Fetch total orders for the last year
      const totalLastYear = await prun.order.aggregate({
        _sum: {
          totalPrice: true,
          totalWeight: true,
        },
        where: {
          userId: userId,
          createdAt: {
            gte: startOfLastYear,
            lte: endOfLastYear,
          },
        },
      });

      // console.log("Total Last Year: ",totalLastYear)
      const details = {
        userDetails,
        last6Orders: userDetails.orders,
        insights: {
          lastMonth: {
            totalPrice: totalLastMonth._sum.totalPrice || 0,
            totalWeight: totalLastMonth._sum.totalWeight || 0,
          },
          lastYear: {
            totalPrice: totalLastYear._sum.totalPrice || 0,
            totalWeight: totalLastYear._sum.totalWeight || 0,
          },
          thisMonth: {
            totalPrice: totalThisMonth._sum.totalPrice || 0,
            totalWeight: totalThisMonth._sum.totalWeight || 0,
          },
          thisYear: {
            totalPrice: totalThisYear._sum.totalPrice || 0,
            totalWeight: totalThisYear._sum.totalWeight || 0,
          },
        },
      };

      console.log(details)

      return NextResponse.json({
        message: details,
        status: 200,
      });
    } catch (error) {
      console.error("Error finding the user: ", error);
      return NextResponse.json({
        message: "Internal server error",
        status: 500,
      });
    }
  } else {
    return NextResponse.json({ message: "Not Authorised", status: 401 });
  }
}
