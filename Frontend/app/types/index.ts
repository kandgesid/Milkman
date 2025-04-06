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
  noOfFamilyMembers: number;
  dailyMilkRequired: number;
}

export interface Milkman {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface newCustomer {
  phoneNumber: string;
  rate: string;
  milkManId: string;
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