export interface User {
  id: number;
  name: string;
  nickname: string;
  email: string;
  blocked: boolean;
  createdAt: string;
  address: string;
  phoneNumber: string;
  profileImage?: string;
}

export interface UserDetail extends User {
  isAdmin?: boolean;
}
