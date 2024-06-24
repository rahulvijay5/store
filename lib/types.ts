type CartItem = {
  type: string;
  size: string;
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

type OrderDbStyle = {
  id: number;
  userId: number;
  totalPrice: number;
  totalWeight: number;
  pickupDate: Date;
  Reg250: number | null;
  Reg500: number | null;
  Reg1000: number | null;
  Sup250: number | null;
  Sup500: number | null;
  Sup1000: number | null;
  createdAt: Date;
  updatedAt: Date;
};

type OrderDbStyleWithUser = {
  id: number;
  userId: number;
  totalPrice: number;
  totalWeight: number;
  pickupDate: Date;
  Reg250: number | null;
  Reg500: number | null;
  Reg1000: number | null;
  Sup250: number | null;
  Sup500: number | null;
  Sup1000: number | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

type User = {
  id: number;
  email: string;
  name: string;
  username: string;
  clerkId: string;
  phoneNumber: string;
  address: string;
  businessName: string;
  orders: OrderDbStyle[];
  createdAt: Date;
  updatedAt: Date;
};

interface AdminDashboardProps {
  mail: string;
}
interface OrderHistoryProps {
  userId: number;
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
  totalWeight: number;
  pickupDate: Date | null;
};

type TypeOfInsights = {
  thisWeeksSales: {
    totalPrice: number;
    totalWeight: number;
  };
  thisMonthsSales: {
    totalPrice: number;
    totalWeight: number;
  };
};

type UserDetailsExpanded = {
  userDetails: User;
  last6Orders: OrderDbStyle[];
  insights: {
    lastMonth: {
      totalPrice: number;
      totalWeight: number;
    };
    lastYear: {
      totalPrice: number;
      totalWeight: number;
    };
    thisMonth: {
      totalPrice: number;
      totalWeight: number;
    };
    thisYear: {
      totalPrice: number;
      totalWeight: number;
    };
  };
};
export type {
  CartItem,
  TypeOfCart,
  Order,
  OrderDbStyle,
  User,
  UserDetailsExpanded,
  TypeOfInsights,
  OrderDbStyleWithUser,
  CartProps,
  Counts,
};
