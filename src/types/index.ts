// Types cho hệ thống quản lý phòng trọ

export interface Building {
  id: string;
  name: string;
  address: string;
  description?: string;
  totalBlocks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Block {
  id: string;
  buildingId: string;
  name: string;
  description?: string;
  totalRooms: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  blockId: string;
  roomNumber: string;
  name: string;
  area: number; // m²
  capacity: number; // số người tối đa
  price: number; // giá thuê/tháng
  status: RoomStatus;
  amenities?: string[]; // tiện nghi: wifi, điều hòa, nóng lạnh...
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const RoomStatus = {
  AVAILABLE: 'available', // Phòng trống
  OCCUPIED: 'occupied',   // Đang cho thuê
  MAINTENANCE: 'maintenance', // Đang bảo trì
  RESERVED: 'reserved'    // Đã đặt cọc
} as const;

export type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];

export interface Tenant {
  id: string;
  roomId: string;
  fullName: string;
  phone: string;
  email?: string;
  idCard: string; // CMND/CCCD
  dateOfBirth: Date;
  hometown?: string;
  moveInDate: Date;
  moveOutDate?: Date;
  deposit: number; // tiền cọc
  monthlyRent: number; // tiền thuê hàng tháng
  status: TenantStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TenantStatus = {
  ACTIVE: 'active',     // Đang thuê
  EXPIRED: 'expired',   // Hết hạn
  PENDING: 'pending'    // Chờ chuyển vào
} as const;

export type TenantStatus = typeof TenantStatus[keyof typeof TenantStatus];

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
