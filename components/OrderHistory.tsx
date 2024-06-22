"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { Order, OrderHistoryComponentProps } from "@/lib/types";

const OrderHistory: React.FC<OrderHistoryComponentProps> = ({ orders }) => {
  // const orders = GetUserOrderHistory()
  console.log(orders);
  const handleDownloadReceipt = (order: Order) => {
    const doc = new jsPDF();
    doc.text("Tea Shop Receipt", 20, 10);
    doc.text(`Date of Order: ${order.createdAt}`, 20, 20);
    doc.text(`Pickup Date: ${order.pickupDate}`, 20, 30);

    doc.text("Product Details:", 20, 40);
    order.items.forEach((item, index) => {
      doc.text(
        `${item.type} ${item.size} x ${item.quantity} = ${
          item.price * (item.quantity / 5)
        }₹`,
        20,
        50 + index * 10
      );
    });

    doc.text(`Total: ${order.totalPrice}₹`, 20, 70 + order.items.length * 10);
    doc.save(`receipt_${Date.now()}.pdf`);
  };

  return (
    <div className="mt-4 p-4 dark:bg-slate-800 border border-black rounded-sm mb-10">
      <h2 className="text-xl font-bold mb-4">Last {orders.length==1?"Order:":orders.length<4?<span>{orders.length} Orders:</span>:"3 Orders:"}</h2>
      <div className="grid md:grid-cols-2 md:gap-4">
        {orders
          .toReversed()
          .slice(0, 3)
          .map((order: Order) => (
            <div
              key={order.id}
              className="mb-4 border px-2 py-4 dark:border-white border-black rounded-sm"
            >
              <div className="flex flex-col mb-4 text-sm justify-between">
                <span className="flex justify-between items-center">
                  <span>Order Date: </span>
                  <span>{order.createdAt}</span>
                </span>
                <span className="flex justify-between items-center">
                  <span>Pickup Date: </span>
                  <span>{order.pickupDate}</span>
                </span>
              </div>
              <div className="mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span>
                      {item.type == "Regular" ? (
                        <span className="font-semibold bg-emerald-500 p-1 rounded-sm dark:text-emerald-500 dark:bg-transparent dark:p-0">
                          {item.type}
                        </span>
                      ) : (
                        <span className="font-semibold bg-yellow-500 p-1 rounded-sm dark:text-yellow-500 dark:bg-transparent dark:p-0">
                          {item.type}
                        </span>
                      )}{" "}
                      {item.size == "250gm"
                            ? "250gm"
                            : item.size == "500gm"
                            ? "500gm"
                            : "1kg"} x {item.quantity}
                    </span>
                    <div className="">
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
                        {item.price *
                          (item.quantity /
                            (5 *
                              (item.size === "250gm"
                                ? 4
                                : item.size === "500gm"
                                ? 2
                                : 1)))}
                        ₹
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 items-center border-t border-black dark:border-white">
                <span className="font-bold text-lg m-1 p-1 border-b-2 border-black dark:border-white">
                  Total: {order.totalPrice}₹
                </span>
                <span className="font-semibold border-b-2 border-black dark:border-white p-1">
                  {order.totalWeight}kg
                </span>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => handleDownloadReceipt(order)}
                  className="mt-2"
                >
                  <Download />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderHistory;
