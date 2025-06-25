export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  auth0_sub: string;
  role_id: number;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: Date;
}

export interface Lead {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  status_id: number;
  assigned_to?: number | null;
  created_at?: Date;
}
