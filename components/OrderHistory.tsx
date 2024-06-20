"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import jsPDF from "jspdf";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

type CartItem = {
  type: "Regular" | "Super";
  size: "250gm" | "500gm" | "1kg";
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  date: string;
  total: number;
  items: CartItem[];
  pickupDate: string;
};

type OrderHistoryProps = {
  orders: Order[];
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const handleDownloadReceipt = (order: Order) => {
    const doc = new jsPDF();
    doc.text("Tea Shop Receipt", 20, 10);
    doc.text(`Date of Order: ${order.date}`, 20, 20);
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

    doc.text(`Total: ${order.total}₹`, 20, 70 + order.items.length * 10);
    doc.save(`receipt_${Date.now()}.pdf`);
  };

  return (
    <div className="mt-4 p-4 dark:bg-slate-800 border border-black rounded-sm mb-10">
      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
      <div className="grid md:grid-cols-2 md:gap-4">
        {orders
          .toReversed()
          .slice(0, 4)
          .map((order: Order) => (
            <div
              key={order.id}
              className="mb-4 border px-2 py-4 dark:border-white border-white rounded-sm"
            >
              <div className="flex justify-between">
                <span>Order Date: {order.date}</span>
                <span>Pickup Date: {order.pickupDate}</span>
              </div>
              <div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
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
                      {item.size} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {item.price * (item.quantity / 5)}₹
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => handleDownloadReceipt(order)}
                  className="mt-2"
                >
                  <Download />
                </Button>
                <span className="font-bold text-lg m-1 border-b-2 border-black dark:border-white">
                  Total: {order.total}₹
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrderHistory;
