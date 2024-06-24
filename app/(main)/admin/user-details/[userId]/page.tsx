"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Loader2Icon, PencilLineIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { OrderDbStyle, UserDetailsExpanded } from "@/lib/types";
import { formatItems, formatNumber } from "@/actions/orderActions";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Searchbox } from "@/components/Searchbox";

export default function UpdateDetails({
  params,
}: {
  params: { userId: number };
}) {
  const userId = params.userId;

  const [userName, setUserName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [usernameUpdating, setUsernameUpdating] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetailsExpanded>();
  const [usernameInputOpen, setUsernameInputOpen] = useState<boolean>(false);
  const [usernameChanged, setUsernameChanged] = useState<boolean>(false);

  const insights = userDetails?.insights;
  const user = userDetails?.userDetails;

  const router = useRouter();
  // const { user } = useUser();
  const { toast } = useToast();

  // const email = user?.emailAddresses[0].emailAddress;
  // const nameOfUser = user?.fullName;
  // const clerkId = user?.id;
  // console.log(user);

  // const handleSubmit = async (e: React.FormEvent) => {
  // e.preventDefault();
  const fetchUserDetails = () => {
    setLoading(true);
    console.log("Button Pressed!");
    try {
      const getOrders = async (userId: number) => {
        const response = await fetch(
          `/api/get-user-details-with-orders?userId=${userId}`,
          {
            method: "GET",
          }
        );
        const res = await response.json();
        if (res.status == 200) {
          setUserDetails(res.message);
          console.log("Got this in orders:", res.message);
        } else if (res.status == 400) {
          console.log(res.message);
          router.push("/admin");
        }
      };
      getOrders(userId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const UserNameHandler = async () => {
    setUsernameUpdating(true);

    try {
      const response = await fetch("/api/update-user-details", {
        method: "POST",
        body: JSON.stringify({
          userId: user?.id,
          userName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.status == 200) {
        setUserName(result.message);
        toast({
          title: "Username updated!🎊🎊",
          variant: "success",
        });
        setUsernameInputOpen(false);
        setUsernameChanged(true)
      } else if (response.status == 409) {
        toast({
          title: result.message,
          description: "Try with some other username!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUsernameUpdating(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    console.log("Fetched User Details! when site loaded");
  }, []);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-6 w-full">
      <div className="text-left mt-2 mb-6 lg:col-span-2 mx-2">
        <div className="w-full">
          <div className=" flex w-full mt-4 justify-end sm:hidden lg:flex">
            <Searchbox />
          </div>
          <div className="flex items-center my-4 justify-between">
            <h1 className="my-2  text-3xl text-nowrap font-semibold">
              User Details:
            </h1>
            <div className="max-w-sm w-full justify-between hidden sm:flex lg:hidden">
              <Searchbox />
            </div>
          </div>
          {user ? (
            <div className="mt-4 grid w-full  dark:bg-gray-900 shadow-lg border rounded-xl">
              <div className=" p-3 rounded-md w-full">
                <p className="text-gray-600">Business Name:</p>
                <h1 className="text-xl font-semibold">{user.businessName}</h1>
              </div>
              <div className=" p-2 rounded-md w-full">
                <p className="text-gray-600">Username:</p>
                {
                  <>
                    <div className="flex items-center justify-between gap-1">
                      {usernameInputOpen && (
                        <div className="flex flex-col">
                          <Input
                            className="text-xl font-semibold mt-2"
                            value={userName}
                            placeholder={user.username}
                            onChange={(e: any) => setUserName(e.target.value)}
                          />
                          {userName != "" ? (
                            <Button
                              className="w-full mt-2"
                              onClick={UserNameHandler}
                              disabled={usernameUpdating}
                            >
                              {usernameUpdating ? (
                                <div className="flex gap-2">
                                  <span className="animate spin">
                                    <Loader2Icon />
                                  </span>
                                  Updating...
                                </div>
                              ):(
                              "Change Username")}
                            </Button>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      )}
                      {!usernameInputOpen && (
                        <h1 className="text-xl font-semibold truncate">
                          {usernameChanged?userName : user.username}
                        </h1>
                      )}
                      <div className=" items-center justify-end">
                        <Button
                          variant={"ghost"}
                          size={"icon"}
                          onClick={() => setUsernameInputOpen((prev) => !prev)}
                        >
                          <PencilLineIcon />
                        </Button>
                      </div>
                    </div>
                  </>
                }
              </div>
              <div className=" p-2 rounded-md">
                <p className="text-gray-600">Phone Number:</p>
                <Link
                  href={`tel:${user.phoneNumber}`}
                  className="text-xl font-semibold"
                >
                  {user.phoneNumber}
                </Link>
              </div>
              <div className=" p-2 rounded-md">
                <p className="text-gray-600">Name:</p>
                <h1 className="text-xl font-semibold">{user.name}</h1>
              </div>
              <div className=" p-2 rounded-md">
                <p className="text-gray-600">Address:</p>
                <h1 className="text-xl font-semibold">{user.address}</h1>
              </div>
              <div className=" p-2 rounded-md text-right mb-2">
                <p className="text-gray-600 text-sm">Email</p>
                <h1 className="text-base font-semibold">{user.email}</h1>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <Skeleton className="w-full">
                <div className="my-4 p-1 rounded-md w-full">
                  <div className="w-1/2 text-lg font-bold bg-gray-600 p-1 rounded-md text-gray-600 my-2">
                    .
                  </div>
                  <p className="w-full bg-gray-700 text-gray-700 text-md p-1 my-1 rounded-md">
                    .
                  </p>
                  <p className="w-full bg-gray-700 text-gray-700 text-md p-1 rounded-md">
                    .
                  </p>
                </div>
              </Skeleton>
            </div>
          )}
        </div>
      </div>
      <div className="lg:col-span-4">
        <Separator className="lg:hidden" />
        <div className="border-0 mb-6 gap-4 mx-2 shadow-sm lg:mt-2 md:justify-center ">
          <h1 className="text-2xl font-semibold mt-4 lg:mt-2 lg:mb-0 mb-2 text-center lg:hidden">
            Insights
          </h1>
          {insights ? (
            <div className="shadow-lg lg:shadow-none lg:mt-6">
              <Card className="flex pb-4 mb-2 w-full">
                <CardHeader className="pb-2 w-full grid gap-2 grid-rows-2">
                  <div>
                    <CardDescription>This Month</CardDescription>
                    <div className="grid grid-cols-2 mb-2">
                      <CardTitle className="text-3xl">
                        {formatNumber(insights.thisMonth.totalWeight)}kg
                      </CardTitle>
                      <CardTitle className="text-3xl">
                        {formatNumber(insights.thisMonth.totalPrice)}₹
                      </CardTitle>
                    </div>
                  </div>
                  <div>
                    <CardDescription className="">This Year</CardDescription>
                    <div className="grid grid-cols-2">
                      <CardTitle className="text-3xl">
                        {formatNumber(insights.thisYear.totalWeight)}kg
                      </CardTitle>
                      <CardTitle className="text-3xl">
                        {formatNumber(insights.thisYear.totalPrice)}₹
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              {insights.lastMonth.totalPrice != 0 ? (
                <Card className="flex pb-4 mb-2 w-full">
                  <CardHeader
                    className={cn(
                      `pb-2 w-full grid ${
                        insights.lastMonth.totalPrice == 0
                          ? "grid-rows-1"
                          : "grid-rows-2 gap-2"
                      }`
                    )}
                  >
                    {/* <CardHeader className="pb-2 w-full grid gap-2 grid-rows-2"> */}
                    <div>
                      <CardDescription>Last Month</CardDescription>
                      <div className="grid grid-cols-2 justify-between items-center w-full mb-2">
                        <CardTitle className="text-3xl">
                          {formatNumber(insights.lastMonth.totalWeight)}kg
                        </CardTitle>
                        <CardTitle className="text-3xl">
                          {formatNumber(insights.lastMonth.totalPrice)}₹
                        </CardTitle>
                      </div>
                    </div>
                    {insights.lastYear.totalPrice != 0 ? (
                      <div>
                        <CardDescription className="">
                          Last Year
                        </CardDescription>
                        <div className="grid grid-cols-2 justify-between items-center">
                          <CardTitle className="text-3xl">
                            {formatNumber(insights.lastYear.totalWeight)}kg
                          </CardTitle>
                          <CardTitle className="text-3xl">
                            {formatNumber(insights.lastYear.totalPrice)}₹
                          </CardTitle>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </CardHeader>
                </Card>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center text-wrap gap-2">
              <span className="animate-spin">
                <Loader2Icon />
              </span>
              Getting insights for you...
            </div>
          )}
        </div>
        <Separator />
        <div className="mt-4 dark:border dark:border-black mx-2 rounded-sm mb-10">
          {loading ? (
            <div className="animate-spin flex items-center justify-center">
              <Loader2Icon />
            </div>
          ) : (
            <div>
              <div className="flex ic justify-between">
                <h2 className="text-2xl font-bold my-4">Recent Orders:</h2>
                <div className="sm:flex items-center justify-center hidden">
                  <Button
                    className="my-2 w-full font-bold bottom-0"
                    variant={"secondary"}
                    onClick={() => {
                      router.push(`/admin/new-order`);
                    }}
                  >
                    Create New Order
                  </Button>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-4 ">
                {userDetails &&
                  userDetails.last6Orders
                    .slice()
                    // .reverse()
                    // .slice(0, 5)
                    .map((order: OrderDbStyle) => (
                      <div
                        key={order.id}
                        className="mb-4 border px-2 py-4 dark:border-white border-black rounded-sm dark:bg-slate-800 shadow-xl"
                      >
                        <div className="flex flex-col mb-4 text-sm justify-between">
                          <span className="flex justify-between items-center">
                            <span>Order Date: </span>
                            <span>
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </span>
                          </span>
                          <span className="flex justify-between items-center">
                            <span>Pickup Date: </span>
                            <span>
                              {new Date(order.pickupDate).toLocaleDateString(
                                "en-IN"
                              )}
                            </span>
                          </span>
                        </div>
                        <div className="mb-4">
                          {formatItems(order).map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between mb-2"
                            >
                              <span>
                                {item.type === "Regular" ? (
                                  <span className="font-semibold bg-emerald-500 p-1 rounded-sm dark:text-emerald-500 dark:bg-transparent dark:p-0">
                                    {item.type}
                                  </span>
                                ) : (
                                  <span className="font-semibold bg-yellow-500 p-1 rounded-sm dark:text-yellow-500 dark:bg-transparent dark:p-0">
                                    {item.type}
                                  </span>
                                )}{" "}
                                {item.size} x {item.quantity}
                              </span>
                              <div>
                                <span className="mr-4 text-gray-500">
                                  {item.quantity /
                                    (item.size === "250gm"
                                      ? 4
                                      : item.size === "500gm"
                                      ? 2
                                      : 1)}
                                  kg
                                </span>
                                <span className="font-semibold">
                                  {item.price}₹
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between mt-2 items-center border-t border-black dark:border-white">
                          <span className="font-semibold text-lg mr-4 border-b-2 border-black dark:border-white p-1">
                            {order.totalWeight}kg
                          </span>
                          <span className="font-bold text-lg m-1 p-1 border-b-2 border-black dark:border-white">
                            Total: {order.totalPrice}₹
                          </span>
                        </div>
                      </div>
                    ))}
                <div className="flex items-center justify-center md:hidden">
                  <Button
                    className="my-2 w-full font-bold bottom-0"
                    variant={"secondary"}
                    onClick={() => {
                      router.push(`/admin/new-order`);
                    }}
                  >
                    Create New Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
