"use client"

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from './ui/button';
import Cart from './Cart';
import { formatDate } from '@/lib/utils';
import OrderHistory from './OrderHistory';
import { useToast } from './ui/use-toast';

type CartItem = {
  type: 'Regular' | 'Super';
  size: '250gm' | '500gm' | '1kg';
  quantity: number;
  price: number;
};

const prices = {
  Regular: { '250gm': 1800, '500gm': 1800, '1kg': 1800 },
  Super: { '250gm': 2000, '500gm': 2000, '1kg': 2000 },
};

type Order = {
  id: number;
  date: string;
  total: number;
  items: CartItem[];
  pickupDate: string;
};

const HomeMain = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [pickupDate, setPickupDate] = useState<Date | null>(new Date());

  const { toast } = useToast()

  const fetchOrders = async (): Promise<Order[]> => {
    // Replace with actual API call
    return [
      {
        id: 1,
        date: "15/06/2024",
        total: 3600,
        items: [{ type: "Regular", size: "250gm", quantity: 40, price: 1800 }],
        pickupDate: "16/06/2024",
      },
      {
        id: 2,
        date: "15/06/2024",
        total: 3600,
        items: [{ type: "Regular", size: "250gm", quantity: 40, price: 1800 }],
        pickupDate: "16/06/2024",
      },
    ];
  };

  useEffect(() => {
    setTimeout(() => {
      fetchOrders().then(data => setOrderHistory(data));
    }, 5000);
  }, []);

  const handleAddToCart = (type: 'Regular' | 'Super', size: '250gm' | '500gm' | '1kg') => {
    const existingItemIndex = cart.findIndex(item => item.type === type && item.size === size);
    const price = prices[type][size];
    const quantityIncrement = size === '250gm' ? 20 : size === '500gm' ? 10 : 5;

    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantityIncrement;
      setCart(updatedCart);
    } else {
      setCart([...cart, { type, size, quantity: quantityIncrement, price }]);
    }
  }; 
  const handleReset = () => {
    setCart([]);
  }

  const handleCreateOrder = () => {
    if (calculateTotal()==0){
      toast({
        title:"Add items to cart first!",
        variant:"destructive"
      })
      return
    }

    const newOrder = {
      id: orderHistory.length + 1,
      date: formatDate(new Date()),
      total: calculateTotal(),
      items: [...cart],
      pickupDate: formatDate(pickupDate),
    };
  
    // Add the new order to the order history
    const updatedOrderHistory = [...orderHistory, newOrder];
    setOrderHistory(updatedOrderHistory);
    setCart([]);
    toast({
      title:"Order Placed!",
      variant:"success",
      description:"Your Order has been placed Successfully🎊"
    })
  };
  
  

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity / 5)), 0);
  };

  return (
    <main className='w-full p-4 lg:grid lg:grid-cols-2 gap-4'>
      <div className=''>
      <p className='text-2xl font-semibold text-center mb-2'>New Order</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid grid-rows-4 gap-2">
          <p className='text-emerald-500 font-bold text-lg flex items-center justify-center'>Regular</p>
          <Button className='bg-emerald-500 hover:bg-emerald-700 font-extrabold text-xl rounded-md text-center p-10 cursor-pointer' onClick={() => handleAddToCart('Regular', '250gm')}>250gm</Button>
          <Button className='bg-emerald-500 hover:bg-emerald-700 font-extrabold text-xl rounded-md text-center p-10 cursor-pointer' onClick={() => handleAddToCart('Regular', '500gm')}>500gm</Button>
          <Button className='bg-emerald-500 hover:bg-emerald-700 font-extrabold text-xl rounded-md text-center p-10 cursor-pointer' onClick={() => handleAddToCart('Regular', '1kg')}>1kg</Button>
        </div>
        <div className="grid grid-rows-4 gap-2">
          <p className='text-yellow-500 font-bold text-lg flex items-center justify-center'>Super</p>
          <Button className='bg-yellow-500 hover:bg-yellow-700 font-extrabold text-xl rounded-md text-center p-10 cursor-pointer' onClick={() => handleAddToCart('Super', '250gm')}>250gm</Button>
          <Button className='bg-yellow-500 hover:bg-yellow-700 font-extrabold text-xl rounded-md text-center p-10 cursor-pointer' onClick={() => handleAddToCart('Super', '500gm')}>500gm</Button>
          <Button className='bg-yellow-500 hover:bg-yellow-700 font-extrabold text-xl rounded-md text-center p-10 cursor-pointer' onClick={() => handleAddToCart('Super', '1kg')}>1kg</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4 w-full">
        <Button onClick={() => setPickupDate(new Date())} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Today</Button>
        <Button onClick={() => setPickupDate(new Date(Date.now() + 86400000))} className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>Tomorrow</Button>
        <div className='w-full text-center'>
          <DatePicker
            selected={pickupDate}
            onChange={(date: Date | null) => setPickupDate(date)}
            dateFormat='dd/MM/yyyy'
            minDate={new Date()}
            className='bg-white text-black p-2 rounded'
            placeholderText='Pick a date'
          />
        </div>
      </div>
      <Cart cart={cart} total={calculateTotal()} pickupDate={pickupDate} />
      <div className='flex gap-2'>
      <Button onClick={handleCreateOrder} className='w-2/3 mt-2 font-bold'>Create Order</Button>
      <Button onClick={handleReset} className='w-1/3 mt-2 font-bold'>Reset</Button>
      </div>
      </div>
      <OrderHistory orders={orderHistory} />

    </main>
  );
};

export default HomeMain;
