import React from "react";
import jsPDF from "jspdf";
import { Button } from "./ui/button";
import { formatDate } from "@/lib/utils";
import { CartItem, CartProps } from "@/lib/types";


const handleDownloadReceipt = (
  cart: CartItem[],
  total: number,
  pickupDate: Date | null
) => {
  const doc = new jsPDF();
  doc.text("Tea Shop Receipt", 20, 10);
  doc.text(`Date of Order: ${formatDate(new Date())}`, 20, 20);
  doc.text(`Pickup Date: ${formatDate(pickupDate)}`, 20, 30);

  doc.text("Product Details:", 20, 40);
  cart.forEach((item, index) => {
    doc.text(
      `${item.type} ${item.size} x ${item.quantity} = ${
        item.price * (item.quantity / 5)
      }₹`,
      20,
      50 + index * 10
    );
  });

  doc.text(`Total: ${total}₹`, 20, 70 + cart.length * 10);
  doc.save("receipt.pdf");
};

const Cart: React.FC<CartProps> = ({ cart, total, totalWeight, pickupDate }) => {
  if (cart.length === 0) return null;

  return (
    <div className="mt-4 p-4 dark:bg-slate-800 border border-black dark:border-white rounded-sm mb-4">
      <h2 className="text-xl font-bold mb-4">Order Summary:</h2>
      {cart.map((item, index) => (
        <div key={index} className="flex justify-between mb-2">
          <span>
            {item.type == "Regular" ? (
              <span className="font-semibold bg-emerald-500 p-1 rounded-sm dark:text-emerald-500 dark:bg-transparent dark:p-0 mr-4">
                {item.type}
              </span>
            ) : (
              <span className="font-semibold bg-yellow-500 p-1 dark:bg-transparent rounded-sm dark:text-yellow-500 dark:p-0 mr-6">
                {item.type}
              </span>
            )}{" "}
            {item.size=="1000gm"?"1kg":item.size} x {item.quantity}
          </span>
          <div className="">
            <span className="mr-4 text-gray-500">{(item.quantity / ((item.size === "250gm" ? 4 : item.size === "500gm" ? 2 : 1)))}kg</span>
          <span className="font-semibold">{item.price * (item.quantity / (5 * (item.size === "250gm" ? 4 : item.size === "500gm" ? 2 : 1)))}₹</span>
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4 font-bold text-lg border-y-2 dark:border-white border-black py-1 mb-2 items-center">
        <span>Total</span>
        <span>{totalWeight}kg</span>
        <span>{total}₹</span>
      </div>
      <div className="flex justify-between items-center">
        <span>Pickup Date</span>
        <span>{formatDate(pickupDate)}</span>
      </div>
    </div>
  );
};

export default Cart;
