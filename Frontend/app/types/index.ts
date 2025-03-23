export interface User {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  confirmPassword: string
  role: string;
}

export interface Milkman {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
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