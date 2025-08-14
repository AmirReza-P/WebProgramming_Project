// Shared TypeScript interfaces for our application data

export interface Product {
  _id: string;
  name: string;
  stock_quantity: number;
  price: number;
  category: string;
  ownerId: string;
}

export interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  buyer: { _id: string, username: string };
  seller: { _id: string, username: string };
  products: OrderProduct[];
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Canceled';
  createdAt: string;
}

export interface InventoryLog {
    _id: string;
    product: { _id: string, name: string };
    type: 'Entrance' | 'Exit';
    quantity_change: number;
    createdAt: string;
}

export interface SalesReport {
    totalSales: number;
    salesDetails: Order[];
}

// For items in the shopping cart
export interface CartItem extends Product {
    quantity: number;
}