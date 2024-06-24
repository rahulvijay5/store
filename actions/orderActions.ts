import { prun } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OrderDbStyle, TypeOfCart } from "@/lib/types";
import { Prices } from "@/lib/constants";

export async function createNewOrder(
  cart: TypeOfCart,
  totalPrice: number,
  totalWeight: number,
  pickupDate: Date,
  userId: number
) {
  try {
    const order = await prun.order.create({
      data: {
        userId: userId, // Assuming you have userId available
        totalPrice: totalPrice,
        totalWeight: totalWeight,
        pickupDate: pickupDate,
      },
    });
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getLoggedInUser(clerkId: string) {
  try {
    const user = await prun.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });
    if (!user) {
      redirect("/update-details");
    }
    return user?.id;
  } catch (error) {
    console.error("Error finding the user: ", error);
    throw error;
  }
}

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat("en-IN").format(number);
};

export const formatItems = (order: OrderDbStyle) => {
  const items = [];
  if (order.Reg250)
    items.push({
      type: "Regular",
      size: "250gm",
      quantity: order.Reg250,
      price: Prices.Regular["250gm"],
    });
  if (order.Reg500)
    items.push({
      type: "Regular",
      size: "500gm",
      quantity: order.Reg500,
      price: Prices.Regular["500gm"],
    });
  if (order.Reg1000)
    items.push({
      type: "Regular",
      size: "1kg",
      quantity: order.Reg1000,
      price: Prices.Regular["1000gm"],
    });
  if (order.Sup250)
    items.push({
      type: "Super",
      size: "250gm",
      quantity: order.Sup250,
      price: Prices.Super["250gm"],
    });
  if (order.Sup500)
    items.push({
      type: "Super",
      size: "500gm",
      quantity: order.Sup500,
      price: Prices.Super["500gm"],
    });
  if (order.Sup1000)
    items.push({
      type: "Super",
      size: "1kg",
      quantity: order.Sup1000,
      price: Prices.Super["1000gm"],
    });
  return items;
};

export async function GetUserOrderHistory(userId: number) {
  try {
    const orders = await prun.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(orders);
    return orders;
  } catch (error) {
    console.error("Error finding the user: ", error);
    throw error;
  }
}
