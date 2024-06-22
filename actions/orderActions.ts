import { currentUser } from "@clerk/nextjs";
import { prun } from "@/lib/prisma";
import { createErrorHandler } from "next/dist/server/app-render/create-error-handler";
import { redirect } from "next/navigation";
import { TypeOfCart } from "@/lib/types";


export async function createNewOrder(
  cart: TypeOfCart,
  totalPrice: number,
  totalWeight: number,
  pickupDate: Date,
  userId: number
) {
  // const user = await currentUser()
  // if(!user){
  //     throw new Error("User not found!")
  // }

  try {
    const order = await prun.order.create(
      {
        data: {
          userId: userId, // Assuming you have userId available
          totalPrice: totalPrice,
          totalWeight: totalWeight,
          pickupDate: pickupDate,
        },
      }
      // include: {
      // items: true, // Include order items in the response
      // },
      // }
    );
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

export async function GetUserOrderHistory(userId:number){
  try{
    const orders = await prun.order.findMany({
      where:{
        userId:userId
      },
      orderBy:{
        createdAt:"desc"
      }
    });
    return orders
  }catch(error){
    console.error("Error finding the user: ",error);
    throw error;
  }
}
