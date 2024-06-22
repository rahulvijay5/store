export const Prices = {
  Regular: { "250gm": 1800, "500gm": 1800, "1000gm": 1800 },
  Super: { "250gm": 2000, "500gm": 2000, "1000gm": 2000 },
};

type CartItem = {
  type: "Regular" | "Super";
  size: "250gm" | "500gm" | "1000gm";
  quantity: number;
  price: number;
};

type TypeOfCart = CartItem[];

type Counts = {
  Reg250: number;
  Reg500: number;
  Reg1000: number;
  Sup250: number;
  Sup500: number;
  Sup1000: number;
};

interface OrderHistoryProps {
  orders: Order[];
}

export interface OrderHistoryComponentProps extends OrderHistoryProps {}
// type OrderHistoryProps = {
//   orders: Order[];
// };

type Order = {
  id: number;
  createdAt: string;
  totalPrice: number;
  totalWeight: number;
  items: CartItem[];
  pickupDate: string;
};

type CartProps = {
  cart: CartItem[];
  total: number;
  totalWeight:number;
  pickupDate: Date | null;
};

export type { CartItem, TypeOfCart, Order, CartProps, Counts };
