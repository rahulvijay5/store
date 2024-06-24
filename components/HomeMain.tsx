"use client";

import { useAuth } from "@clerk/nextjs";
import DatePicker from "react-datepicker";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

import Cart from "./Cart";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { TypeOfCart, CartItem, Counts, Order } from "@/lib/types";
import { Prices } from "@/lib/constants";
import { ToastAction } from "./ui/toast";

const HomeMain = () => {
  const initialCart = [
    { type: "Regular", size: "250gm", quantity: 0, price: 0 },
    { type: "Regular", size: "500gm", quantity: 0, price: 0 },
    { type: "Regular", size: "1000gm", quantity: 0, price: 0 },
    { type: "Super", size: "250gm", quantity: 0, price: 0 },
    { type: "Super", size: "500gm", quantity: 0, price: 0 },
    { type: "Super", size: "1000gm", quantity: 0, price: 0 },
  ];

  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const [userIdInDb, setUserIdInDb] = useState<number>();
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [pickupDate, setPickupDate] = useState<Date | null>(new Date());
  const [isInitialFetchDone, setIsInitialFetchDone] = useState<boolean>(false);

  const { toast } = useToast();
  const { userId } = useAuth();
  const router = useRouter();

  const checkUser = async () => {
    if (!isInitialFetchDone) {
      try {
        const response = await fetch(
          `/api/get-logged-in-user?clerk=${userId}`,
          {
            method: "GET",
          }
        );
        const res = await response.json();
        if (res.status == 200) {
          // Do further steps in here, if needed!
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
    console.log("useEffect triggered as site entered");
    checkUser();
  }, [isInitialFetchDone]);

  const handleCancel = () => {
    setCart(initialCart);
  };

  const handleAddProduct = (
    type: "Regular" | "Super",
    size: "250gm" | "500gm" | "1000gm"
  ) => {
    const priceOfProduct = Prices[type][size];
    const quantityIncrement = size === "250gm" ? 20 : size === "500gm" ? 10 : 5;
    const updatedCart = cart.map((item) => {
      if (item.type == type && item.size == size) {
        return {
          ...item,
          quantity: item.quantity + quantityIncrement,
          price: item.price + priceOfProduct,
        };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const getIndividualCounts = (cart: TypeOfCart) => {
    console.log("Cart: (get individual counts)", cart);
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
    setIsLoading(true)
    console.log("Cart: (when create order is pressed)", cart);
    if (calculateTotal() == 0) {
      toast({
        title: "Add items to cart first!",
        variant: "destructive",
      });
      setIsLoading(false)
      return;
    }

    if (userId) {
      try {
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
        if (result.status === 200) {
          toast({
            title: "Order Placed!",
            variant: "success",
            description: "Your Order has been placed Successfully🎊",
            action: (
              <ToastAction
                altText="Past Orders"
                onClick={() => {
                  router.push(`/order-history/${userIdInDb}`);
                }}
              >
                View Last Orders
              </ToastAction>
            ),
          });
        } else {
          toast({
            title: "Something went wrong",
            description: result.message || "Try again after sometime.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error creating order:", error);
      } finally {
        console.log("Yo");
      }
      setIsLoading(false)
    }

    // const newOrder = {
    //   id: orderHistory.length + 1,
    //   createdAt: formatDate(new Date()),
    //   totalPrice: calculateTotal(),
    //   totalWeight: calculateTotalWeight(),
    //   items: [...cart],
    //   pickupDate: formatDate(pickupDate),
    // };
    // console.log("NewOrder: ", newOrder);

    // Add the new order to the order history
    // const updatedOrderHistory = [...orderHistory, newOrder];
    // console.log("Updated Order History: ", updatedOrderHistory);
    // setOrderHistory(updatedOrderHistory);
    // console.log("Order History: ", orderHistory);
    
    setCart(initialCart);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const needFor1Kg =
        item.size === "250gm" ? 4 : item.size === "500gm" ? 2 : 1;
      return total + item.price;
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
    <main className="w-full px-4 grid md:grid-cols-2 gap-4 grid-cols-1 justify-between">
      <div className="">
        <p className="text-2xl font-semibold text-center mb-8">New Order</p>
      <div className="flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-2 drop-shadow-sm shadow-black border rounded-md pt-4 px-1">
          <div>
            <p className="text-emerald-500 font-bold text-2xl mb-4 flex items-center justify-center">
              Regular
            </p>
            <div className="grid grid-rows-3 gap-2">
              <Button
                className="bg-emerald-500 hover:bg-emerald-700 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddProduct("Regular", "250gm")}
              >
                250gm
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-700 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddProduct("Regular", "500gm")}
              >
                500gm
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-700 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddProduct("Regular", "1000gm")}
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
                onClick={() => handleAddProduct("Super", "250gm")}
              >
                250gm
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddProduct("Super", "500gm")}
              >
                500gm
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 font-extrabold shadow-sm shadow-gray-500 text-xl rounded-md text-center p-10 cursor-pointer"
                onClick={() => handleAddProduct("Super", "1000gm")}
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
        <div className="sm:hidden">
        <Cart
          cart={cart}
          total={calculateTotal()}
          totalWeight={calculateTotalWeight()}
          pickupDate={pickupDate}
        />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateOrder} disabled={isLoading} className="w-full mt-2 font-bold">
            Create Order
          </Button>
          {calculateTotal() > 0 ? (
            <Button onClick={handleCancel} disabled={isLoading} className="w-1/3 mt-2 font-bold">
              Cancel
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Button
          className="my-4 w-full font-bold bottom-0"
          variant={"secondary"}
          onClick={() => {
            router.push(`/order-history/${userIdInDb}`);
          }}
        >
          View Last Orders
          {/* {userIdInDb ? (
          // {true ? (
          <OrderHistory userId={userIdInDb} />
        ) : (
          ""
        )} */}
        </Button>
      </div>
      </div>
      <div className="hidden w-full sm:flex items-center justify-center">
        <div className="w-full max-w-sm">
        <Cart
          cart={cart}
          total={calculateTotal()}
          totalWeight={calculateTotalWeight()}
          pickupDate={pickupDate}
        />
        </div>
      </div>
    </main>
  );
};
export default HomeMain;
