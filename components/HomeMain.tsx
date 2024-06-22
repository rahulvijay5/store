"use client";

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "./ui/button";
import Cart from "./Cart";
import { formatDate } from "@/lib/utils";
import OrderHistory from "./OrderHistory";
import { useToast } from "./ui/use-toast";
import { createNewOrder, getLoggedInUser } from "@/actions/orderActions";
import { useAuth } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { TypeOfCart, CartItem, Counts, Order, Prices } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { CloudDrizzle } from "lucide-react";
import Confetti from 'react-confetti'

const HomeMain = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userIdInDb, setUserIdInDb] = useState<number>();
  const [orderHistory, setOrderHistory] = useState<Order[] | []>([]);
  const [pickupDate, setPickupDate] = useState<Date | null>(new Date());
  const [isInitialFetchDone, setIsInitialFetchDone] = useState<boolean>(false);

  const { toast } = useToast();
  const { userId } = useAuth();
  const router = useRouter();
  console.log(isInitialFetchDone);

  // const fetchOrders = async (): Promise<Order[]> => {
  //   // Replace with actual API call
  //   return [
  //     // {
  //     //   id: 1,
  //     //   date: "15/06/2024",
  //     //   total: 3600,
  //     //   items: [{ type: "Regular", size: "250gm", quantity: 40, price: 1800 }],
  //     //   pickupDate: "16/06/2024",
  //     // },
  //     // {
  //     //   id: 2,
  //     //   date: "15/06/2024",
  //     //   total: 3600,
  //     //   items: [{ type: "Regular", size: "250gm", quantity: 40, price: 1800 }],
  //     //   pickupDate: "16/06/2024",
  //     // },
  //   ];
  // };

  const checkUser = async () => {
    if (!isInitialFetchDone) {
      console.log("I am here");
      try {
        const response = await fetch(
          `/api/get-logged-in-user?clerk=${userId}`,
          {
            method: "GET",
          }
        );
        const res = await response.json();
        if (res.status == 200) {
          console.log("Do further Steps");
          setUserIdInDb(res.message);
          // fetchOrders().then((data) => setOrderHistory(data));
        } else {
          console.log("User does not exist, redirecting to add user details");
          router.push("/update-details");
        }
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setIsInitialFetchDone(true);
      }
    } else {
      console.log("Initial fetch already done:", isInitialFetchDone);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
    checkUser();
  }, [isInitialFetchDone]);

  const handleAddToCart = (
    type: "Regular" | "Super",
    size: "250gm" | "500gm" | "1000gm"
  ) => {
    const existingItemIndex = cart.findIndex(
      (item) => item.type === type && item.size === size
    );
    const price = Prices[type][size];
    const quantityIncrement = size === "250gm" ? 20 : size === "500gm" ? 10 : 5;

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantityIncrement;
      setCart(updatedCart);
    } else {
      setCart([...cart, { type, size, quantity: quantityIncrement, price }]);
    }
  };
  const handleCancel = () => {
    setCart([]);
  };

  const getIndividualCounts = (cart: TypeOfCart) => {
    console.log(cart);
    const counts: Counts = {
      Reg250: 0,
      Reg500: 0,
      Reg1000: 0,
      Sup250: 0,
      Sup500: 0,
      Sup1000: 0,
    };

    cart.forEach((item: CartItem) => {
      const key = `${
        item.type.charAt(0).toUpperCase() + item.type.slice(1, 3)
      }${item.size.replace("gm", "")}` as keyof Counts;
      counts[key] += item.quantity;
    });

    return counts;
  };

  const handleCreateOrder = async () => {
    console.log(cart);
    if (calculateTotal() == 0) {
      toast({
        title: "Add items to cart first!",
        variant: "destructive",
      });
      return;
    }

    if (userId) {
      try {
        const response = await fetch(
          `/api/get-logged-in-user?clerk=${userId}`,
          {
            method: "GET",
          }
        );
        const res = await response.json();
        if (res.status == 200) {
          setUserIdInDb(res.message);
          const totalPrice = calculateTotal();
          const totalWeight = calculateTotalWeight();

          const { Reg250, Reg500, Reg1000, Sup250, Sup500, Sup1000 } =
            getIndividualCounts(cart);

          const orderDetails = {
            userId: userIdInDb,
            totalPrice,
            totalWeight,
            pickupDate,
            Reg250,
            Reg500,
            Reg1000,
            Sup250,
            Sup500,
            Sup1000,
          };

          const orderResponse = await fetch("/api/create-new-order", {
            method: "POST",
            body: JSON.stringify(orderDetails),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const result = await orderResponse.json();
          if (orderResponse.status === 200) {
            toast({
              title: "Order Placed!",
              description: "Your order has been placed successfully!",
              variant: "success",
            });
          } else {
            toast({
              title: "Error",
              description: result.message || "Something went wrong!",
              variant: "destructive",
            });
          }
        } else if (res.status === 404) {
          router.push("/add-user-details");
        }
      } catch (error) {
        console.error("Error creating order:", error);
      } finally {
        console.log("Yo");
      }
    }

    const newOrder = {
      id: orderHistory.length + 1,
      createdAt: formatDate(new Date()),
      totalPrice: calculateTotal(),
      totalWeight: calculateTotalWeight(),
      items: [...cart],
      pickupDate: formatDate(pickupDate),
    };
    console.log(newOrder);

    // Add the new order to the order history
    const updatedOrderHistory = [...orderHistory, newOrder];
    console.log("Updated Order History: ", updatedOrderHistory);
    setOrderHistory(updatedOrderHistory);
    console.log("Order History: ", orderHistory);
    setCart([]);
    toast({
      title: "Order Placed!",
      variant: "success",
      description: "Your Order has been placed Successfully🎊",
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const needFor1Kg =
        item.size === "250gm" ? 4 : item.size === "500gm" ? 2 : 1;
      return total + item.price * (item.quantity / (5 * needFor1Kg));
    }, 0);
  };
  const calculateTotalWeight = () => {
    return cart.reduce((total, item) => {
      const needFor1Kg =
        item.size === "250gm" ? 4 : item.size === "500gm" ? 2 : 1;
      return total + item.quantity / needFor1Kg;
    }, 0);
  };

  return (
    <main className="w-full px-4 lg:grid lg:grid-cols-2 gap-4">
      <div className="">
        <p className="text-2xl font-semibold text-center mb-8">New Order</p>
        <div className="grid grid-cols-2 gap-2 drop-shadow-sm shadow-black border rounded-md pt-4 px-1">
          <div>
            <p className="text-emerald-500 font-bold text-2xl mb-4 flex items-center justify-center">
              Regular
            </p>
            <div className="grid grid-rows-3 gap-2">
              <Button
                className="bg-emerald-500 hover:bg-emerald-700 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddToCart("Regular", "250gm")}
              >
                250gm
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-700 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddToCart("Regular", "500gm")}
              >
                500gm
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-700 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddToCart("Regular", "1000gm")}
              >
                1kg
              </Button>
            </div>
          </div>
          <div>
            <p className="text-yellow-500 font-bold text-2xl mb-4 flex items-center justify-center">
              Super
            </p>
            <div className="grid grid-rows-3 gap-2">
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddToCart("Super", "250gm")}
              >
                250gm
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddToCart("Super", "500gm")}
              >
                500gm
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddToCart("Super", "1000gm")}
              >
                1kg
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4 w-full  items-center">
          <span>Pickup Date:</span>
          <Button
            onClick={() => setPickupDate(new Date())}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Today
          </Button>
          <Button
            onClick={() => setPickupDate(new Date(Date.now() + 86400000))}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          >
            Tomorrow
          </Button>
          <div className="w-full text-center border-2 rounded border-black/50">
            <DatePicker
              selected={pickupDate}
              onChange={(date: Date | null) => setPickupDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="bg-white text-black p-2 w-full rounded"
              placeholderText="Pick a date"
            />
          </div>
        </div>
        <Cart
          cart={cart}
          total={calculateTotal()}
          totalWeight={calculateTotalWeight()}
          pickupDate={pickupDate}
        />
        <div className="flex gap-2">
          <Button onClick={handleCreateOrder} className="w-full mt-2 font-bold">
            Create Order
          </Button>
          {cart.length > 0 ? (
            <Button onClick={handleCancel} className="w-1/3 mt-2 font-bold">
              Cancel
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="mt-10">
        {orderHistory.length > 0 && userIdInDb ? (
          <OrderHistory orders={orderHistory} />
        ) : (
          ""
        )}
      </div>
    </main>
  );
};
export default HomeMain;
