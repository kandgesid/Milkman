export interface User {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  confirmPassword: string
  role: string;
  noOfFamilyMembers: string;
  dailyMilkRequired: string;
}

export interface UserLogin {
  phoneNumber: string;
  password: string;
  role: string;
}

export interface Customer {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  familySize: number;
  defaultMilkQty: number;
  milkRate: number;
  dueAmount: number;
}

export interface Order{
    milkmanCustomerId: string;
    orderId: string;
    customerName: string;
    note: string;
    orderDate: string;
    milkQuantity: number;
    status: string;
    customerAddress: string;
}

export interface MyOrder{
    milkmanCustomerId: string;
    orderId: string;
    milkmanName: string;
    note: string;
    orderDate: string;
    quantity: number;
    status: string;
    rate: number;
    amount: number;
}

export interface Milkman {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  milkRate: number;
  dueAmount: number;
}

export interface newOrder {
  customerId: string;
  milkmanId: string;
  requestedQuantity: number;
  orderDate: Date;
}

export interface newCustomer {
  phoneNumber: string;
  rate: string;
  milkManId: string;
}

  export interface confirmOrder {
    orderDate: String;
    remark?: string;
  }

  export interface cancleOrder {
    orderDate: String;
    remark?: string;
  }

export interface UserFormProps {
  formData: Milkman;
  setFormData: (user: Milkman) => void;
  onSubmit: () => void;
  editingId: number | null;
}

export interface UserListProps {
  users: User[];
  onEdit: (user: Milkman) => void;
  onDelete: (id: number) => void;
} 