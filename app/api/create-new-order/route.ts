import { cleanup, prun } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestbody = await req.json();
  const {
    userId,
    totalPrice,
    totalWeight,
    pickupDate,
    Reg250,
    Reg500,
    Reg1000,
    Sup250,
    Sup500,
    Sup1000,
  }: {
    userId: number;
    totalPrice: number;
    totalWeight: number;
    pickupDate: Date;
    Reg250: number;
    Reg500: number;
    Reg1000: number;
    Sup250: number;
    Sup500: number;
    Sup1000: number;
  } = requestbody;

  try {
    const order = await prun.order.create({
      data: {
        userId: userId,
        totalPrice: totalPrice,
        totalWeight: totalWeight,
        pickupDate: pickupDate,
        Reg250: Reg250,
        Reg500: Reg500,
        Reg1000: Reg1000,
        Sup250: Sup250,
        Sup500: Sup500,
        Sup1000: Sup1000,
      },
    });
    console.log("Got a new Order:",order)
    return NextResponse.json({message: order,status:200});
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  } finally {
    await cleanup();
  }
}
