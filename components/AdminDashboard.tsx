"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import {
  ArrowUpRightFromCircle,
  BarChart2,
  MoveUpRight,
  Phone,
  PlusCircle,
  RefreshCcwIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { OrderDbStyle, OrderDbStyleWithUser } from "@/lib/types";
import { Prices } from "@/lib/constants";
import Insights from "./Insights";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/actions/orderActions";
import { Searchbox } from "./Searchbox";

export default function AdminDashboard({ mail }: { mail: string }) {
  const [take, setTake] = useState<number>(8);
  const [orders, setOrders] = useState<OrderDbStyleWithUser[]>([]);
  const [lastOrders, setLastOrders] = useState<OrderDbStyleWithUser[]>([]);
  const [isInsightsOpen, setIsInsightsOpen] = useState<boolean>(false);

  const router = useRouter();
  const soundEffect = new Audio("/notification.mp3");

  const getOrders = async (mail: string, take: number) => {
    const response = await fetch(
      `/api/get-latest-orders?mailToCheck=${mail}&take=${take}`,
      {
        method: "GET",
      }
    );
    const res = await response.json();
    if (res.status == 200) {
      setOrders(res.message);
      // console.log("Got this in orders:", res.message);
    }
  };
  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("I am called again!");

      await getOrders(mail, take);

      if (JSON.stringify(orders) === JSON.stringify(lastOrders)) {
        console.log("No change");
      } else {
        console.log("Aaya aaya, naya order aaya 🥳🥳");
        setLastOrders(orders);
      }
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [orders, lastOrders, getOrders, mail, take]);

  const handleRefresh = () => {
    setTake(8);
    getOrders(mail, take);
  };

  const handleViewMore = () => {
    setTake((prevTake) => prevTake + 8);
    console.log(take);
    getOrders(mail, take);
  };
  const handleNewOrder = () => {
    router.push("/admin/new-order");
  };
  const handleUpdateDetails = (userId: number) => {
    router.push(`/admin/user-details/${userId}`);
  };

  const totalRegular = (order: OrderDbStyle) =>
    ((order.Reg250 ?? 0) / 20 +
      (order.Reg500 ?? 0) / 10 +
      (order.Reg1000 ?? 0) / 5) *
    Prices["Regular"]["250gm"];
  const totalSuper = (order: OrderDbStyle) =>
    ((order.Sup250 ?? 0) / 20 +
      (order.Sup500 ?? 0) / 10 +
      (order.Sup1000 ?? 0) / 5) *
    Prices["Super"]["250gm"];

  return (
    <div className="overflow-hidden">
      <div className="w-full flex justify-between items-center">
        <Button
          variant={"ghost"}
          onClick={handleNewOrder}
          className="items-end mb-6 flex gap-1"
        >
          New Order <PlusCircle />
        </Button>
        <div className="items-center hidden justify-center md:flex w-full">
        <Searchbox />
      </div>
        <div className="flex gap-2">
          <Button
            variant={"ghost"}
            onClick={() =>
              setIsInsightsOpen((isInsightsOpen) => !isInsightsOpen)
            }
            className="items-end mb-6 flex gap-1"
          >
            Insights <BarChart2 />
          </Button>
          <Button onClick={handleRefresh} variant={"ghost"} size={"icon"}>
            <RefreshCcwIcon />
          </Button>
        </div>
      </div>
      <div className="mb-2 flex w-full items-center md:hidden justify-end">
        <Searchbox />
      </div>
      {isInsightsOpen && <Insights />}
      <Table className="text-lg border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="text-nowrap">Customer</TableHead>
            <TableHead className="text-nowrap">Total Weight</TableHead>
            <TableHead className="text-nowrap">Order Time</TableHead>
            <TableHead className="text-nowrap">Pickup Date</TableHead>
            {/* <TableHead>Status</TableHead> */}
            <TableHead>Amount</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <>
              <TableRow key={order.id}>
                <TableCell className="text-nowrap w-full max-w-64 overflow-hidden truncate">
                  {order.user.username
                    ? `${order.user.username}`
                    : order.user.businessName
                    ? `${order.user.businessName}`
                    : `${order.user.name}`}
                </TableCell>
                <TableCell className="text-center">
                  {order.totalWeight}kg
                </TableCell>
                  <TableCell className="text-center text-nowrap">
                    <div className="">{new Date(order.createdAt).toLocaleDateString("en-IN", {day: 'numeric', month:'short'})}</div> 
                    <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleTimeString("en-IN", {hour: '2-digit', minute:'2-digit'})} </div>
                  </TableCell>
                <TableCell className="text-center">
                  {new Date(order.pickupDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </TableCell>
                {/* <TableCell>
                  <Badge variant="outline">Delivered</Badge>
                </TableCell> */}
                <TableCell className="text-center">
                  {formatNumber(order.totalPrice)}₹
                </TableCell>
                <TableCell>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="px-4 sm:px-8 mx-4 md:mx-8 text-lg min-h-[90vh] md:min-h-[80vh]">
                      <DrawerHeader className="flex justify-between items-center px-0 mb-2">
                        <div className="items-start">
                          <DrawerTitle className="my-2 text-left">
                            Order Details
                          </DrawerTitle>
                          <DrawerDescription className="">
                            <div className="text-left font-light text-sm text-gray-700">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-In"
                              )}
                            </div>
                          </DrawerDescription>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div>
                            {/* <Button
                              variant={"ghost"}
                              className="items-center justify-center gap-1 py-4"
                            >
                              <div className="font-medium text-sm">Status:</div>
                              <Badge
                                variant={"outline"}
                                className="text-green-500 text-base"
                              >
                                Delivered
                              </Badge>
                            </Button> */}
                            <Button
                              variant={"outline"}
                              size={"icon"}
                              onClick={() => `tel:${order.user.phoneNumber}`}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DrawerHeader>
                      <div className="mb-3">
                        <div className="flex justify-between">
                          <div className=" text-gray-600 text-sm">Name</div>
                          <span className="font-light text-gray-700 text-sm text-right">
                            {new Date(order.createdAt).toLocaleString("en-In" , {day:"numeric",month:"short",hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="text-lg">
                          {order.user.username
                            ? `${order.user.username}`
                            : order.user.businessName
                            ? `${order.user.businessName}`
                            : `${order.user.name}`}
                        </div>
                      </div>
                      <div className="gap-8 w-full md:flex">
                        <div className="grid sm:grid-cols-2 gap-4 md:w-1/2 mb-4 md:mb-0">
                          {totalRegular(order) != 0 && (
                            <div className="border dark:border-green-200 bg-green-900/40 p-4 text-black dark:text-white rounded-md">
                              <div className="font-medium dark:text-green-200 border-b-2 border-black dark:border-green-200 mb-4 pb-1 flex items-center justify-between">
                                <span>Regular</span>{" "}
                                <span className="dark:text-white font-semibold">
                                  {totalRegular(order)}₹
                                </span>
                              </div>
                              {order.Reg250 ? (
                                <div className="flex items-center justify-between mb-1">
                                  <span>250gm</span>
                                  <div className="flex w-1/2 justify-between items-center">
                                    <span>{order.Reg250}</span>
                                    <span>{order.Reg250 / 4}kg</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="hidden"></div>
                              )}
                              {order.Reg500 ? (
                                <div className="flex items-center justify-between mb-1">
                                  <span>500gm</span>
                                  <div className="flex w-1/2 justify-between items-center">
                                    <span>{order.Reg500}</span>
                                    <span>{order.Reg500 / 2}kg</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="hidden"></div>
                              )}
                              {order.Reg1000 ? (
                                <div className="flex items-center justify-between mb-1">
                                  <span>1kg</span>
                                  <div className="flex w-1/2 justify-between items-center">
                                    <span>{order.Reg1000}</span>
                                    <span>{order.Reg1000}kg</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="hidden"></div>
                              )}
                            </div>
                          )}
                          {totalSuper(order) != 0 && (
                            <div className="border dark:border-yellow-200 bg-yellow-800/40 text-black dark:text-white p-4 rounded-md">
                              <div className="font-medium dark:text-yellow-200 border-b-2 border-black dark:border-yellow-200 mb-4 pb-1 flex items-center justify-between">
                                <span>Super</span>{" "}
                                <span className="dark:text-white font-semibold">
                                  {totalSuper(order)}₹
                                </span>
                              </div>
                              {order.Sup250 ? (
                                <div className="flex items-center justify-between mb-1">
                                  <span>250gm</span>
                                  <div className="flex w-1/2 justify-between items-center">
                                    <span>{order.Sup250}</span>
                                    <span>{order.Sup250 / 4}kg</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="hidden"></div>
                              )}
                              {order.Sup500 ? (
                                <div className="flex items-center justify-between mb-1">
                                  <span>500gm</span>
                                  <div className="flex items-center w-1/2 justify-between">
                                    <span>{order.Sup500}</span>
                                    <span>{order.Sup500 / 2}kg</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="hidden"></div>
                              )}
                              {order.Sup1000 ? (
                                <div className="flex items-center justify-between mb-1">
                                  <span>1kg</span>
                                  <div className="flex w-1/2 justify-between items-center">
                                    <span>{order.Sup1000}</span>
                                    <span>{order.Sup1000}kg</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="hidden"></div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="md:w-1/2 flex flex-col gap-4">
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <div className="py-1 border rounded-md flex flex-col items-center justify-center gap-1">
                              <div className="font-medium pb-1">
                                Total Weight
                              </div>
                              <Separator />
                              <div className="text-xl font-bold">
                                {order.totalWeight}kg
                              </div>
                            </div>
                            <div className="py-1 border rounded-md flex flex-col items-center justify-center gap-1">
                              <div className="font-medium pb-1">
                                Total Price
                              </div>
                              <Separator />
                              <div className="text-xl font-bold">
                                {order.totalPrice}₹
                              </div>
                            </div>
                            {/* </div> */}
                          </div>
                          <div className="flex justify-between">
                            <div className="font-light">Pickup Date:</div>
                            <div>
                              {new Date(order.pickupDate).toLocaleDateString(
                                "en-In"
                              )}
                            </div>
                          </div>
                          <Separator />
                          <div className="flex">
                            <div className="grid grid-cols-2 grid-flow-row-dense w-11/12">
                              <div>
                                <div className=" text-gray-600 text-sm">
                                  Phone Number
                                </div>
                                <div>{order.user.phoneNumber}</div>
                              </div>

                              <div className="col-span-2 my-2">
                                <div className=" text-gray-600 text-sm">
                                  Address
                                </div>
                                <div>{order.user.address}</div>
                              </div>
                            </div>
                            <div className="w-1/11">
                              <Button
                                variant={"ghost"}
                                onClick={() =>
                                  handleUpdateDetails(order.userId)
                                }
                                size={"icon"}
                                className="font-semibold"
                              >
                                <ArrowUpRightFromCircle />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end mt-2 mb-4">
        <Button onClick={handleViewMore} variant={"outline"}>
          View More <MoveUpRight />
        </Button>
      </div>
    </div>
  );
}
