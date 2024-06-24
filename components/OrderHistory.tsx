"use client";

import jsPDF from "jspdf";
import { Button } from "./ui/button";
import { Download, Loader2Icon } from "lucide-react";
import { OrderDbStyle } from "@/lib/types";
import { Prices } from "@/lib/constants";
import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import { formatItems } from "@/actions/orderActions";

export default function OrderHistory({ userId }: { userId: number }) {
  const [orders, setOrders] = useState<OrderDbStyle[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const getOrders = async (userId: number) => {
    const response = await fetch(
      `/api/get-user-order-history?userId=${userId}`,
      {
        method: "GET",
      }
    );
    const res = await response.json();
    if (res.status == 200) {
      setOrders(res.message);
      console.log("Got this in orders:", res.message);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    console.log("useEffect triggered on order history page");
    getOrders(userId);
    setIsLoading(false);
  }, []);

  const handleDownloadReceipt = async (order: OrderDbStyle) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Create a temporary div to style the receipt
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "-9999px";
    tempDiv.style.backgroundColor = "#4CAF50"; // Soft green color
    tempDiv.style.padding = "0px";
    tempDiv.style.fontFamily = "Arial, sans-serif";
    tempDiv.style.width = `${pageWidth - 40}px`;
    tempDiv.style.color = "black";
    tempDiv.style.fontSize = "6px";

    // Add content to the temporary div
    tempDiv.innerHTML = `
    <div style="border: 1px solid black;">
      <h2 style="text-align: center;">Vijay Shree Tea Traders</h2>
      <p>Date of Order: ${new Date(order.createdAt).toLocaleString("en-IN")}</p>
      <p>Pickup Date: ${new Date(order.pickupDate).toLocaleDateString(
        "en-IN"
      )}</p>
      <h3>Product Details:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="border-bottom: 1px solid white; padding: 5px;">Type</th>
            <th style="border-bottom: 1px solid white; padding: 5px;">Size</th>
            <th style="border-bottom: 1px solid white; padding: 5px;">Quantity</th>
            <th style="border-bottom: 1px solid white; padding: 5px;">Price</th>
          </tr>
        </thead>
        <tbody style="height:5px;">
          ${formatItems(order)
            .map(
              (item) => `
            <tr>
              <td style="border-bottom: 1px solid white; padding: 5px;">${item.type}</td>
              <td style="border-bottom: 1px solid white; padding: 5px;">${item.size}</td>
              <td style="border-bottom: 1px solid white; padding: 5px;">${item.quantity} packets</td>
              <td style="border-bottom: 1px solid white; padding: 5px;">${item.price}₹</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <h3 style="text-align:right; font:bold; margin-right:5px;">Total: ${
        order.totalPrice
      }₹</h3>
      <p>Contact us for any details at +919413153999</p>
      <p style="text-align: center; font-style: italic;">Thank you for your purchase!</p>
      </div>
    `;

    document.body.appendChild(tempDiv);

    // Render the temporary div to a canvas
    const canvas = await html2canvas(tempDiv, {
      backgroundColor: "#4CAF50", // Same soft green color
      scale: 4,
    });

    // Remove the temporary div
    document.body.removeChild(tempDiv);

    // Add the rendered canvas to the PDF
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 10, 10, pageWidth - 20, pageHeight - 20);
    doc.save(`receipt_${Date.now()}.pdf`);
  };

  return (
    <div className="mt-4 dark:border dark:border-black rounded-sm mb-10">
      {isLoading ? (
        <div className="animate-spin flex items-center justify-center">
          <Loader2Icon />
        </div>
      ) : (
        <div>
          <div className="flex ic justify-between">
          <h2 className="text-2xl font-bold my-4">
            Last{" "}
            {orders.length === 1
              ? "Order:"
              : orders.length < 4
              ? `${orders.length} Orders:`
              : "3 Orders:"}
          </h2>
          <div className="sm:flex items-center justify-center hidden">
              <Button
                className="my-2 w-full font-bold bottom-0"
                variant={"secondary"}
                onClick={() => {
                  router.push(`/`);
                }}
              >
                Create New Order
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 ">
            {orders
              .slice()
              // .reverse()
              .slice(0, 3)
              .map((order: OrderDbStyle) => (
                <div
                  key={order.id}
                  className="mb-4 border px-2 py-4 dark:border-white border-black rounded-sm dark:bg-slate-800"
                >
                  <div className="flex flex-col mb-4 text-sm justify-between">
                    <span className="flex justify-between items-center">
                      <span>Order Date: </span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </span>
                    <span className="flex justify-between items-center">
                      <span>Pickup Date: </span>
                      <span>
                        {new Date(order.pickupDate).toLocaleDateString("en-IN")}
                      </span>
                    </span>
                  </div>
                  <div className="mb-4">
                    {formatItems(order).map((item, index) => (
                      <div key={index} className="flex justify-between mb-2">
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
                          <span className="font-semibold">{item.price}₹</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 items-center border-t border-black dark:border-white">
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => handleDownloadReceipt(order)}
                      className="mt-2"
                    >
                      <Download />
                    </Button>
                    <div>
                      <span className="font-semibold text-lg mr-4 border-b-2 border-black dark:border-white p-1">
                        {order.totalWeight}kg
                      </span>
                      <span className="font-bold text-lg m-1 p-1 border-b-2 border-black dark:border-white">
                        Total: {order.totalPrice}₹
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            <div className="flex items-center justify-center md:hidden">
              <Button
                className="my-2 w-full font-bold bottom-0"
                variant={"secondary"}
                onClick={() => {
                  router.push(`/`);
                }}
              >
                Create New Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
