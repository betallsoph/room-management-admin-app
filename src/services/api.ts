// API Service Layer - Skeleton cho việc gắn API thật sau này
import type { Building, Block, Floor, Room, Tenant, ApiResponse } from '../types';

// Base API URL - thay đổi khi có backend thật
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Generic fetch wrapper
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`, // Thêm sau khi có auth
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============ BUILDING API ============
export const buildingAPI = {
  getAll: async (): Promise<ApiResponse<Building[]>> => {
    // TODO: Thay bằng API call thật
    return fetchAPI<Building[]>('/buildings');
  },

  getById: async (id: string): Promise<ApiResponse<Building>> => {
    return fetchAPI<Building>(`/buildings/${id}`);
  },

  create: async (data: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Building>> => {
    return fetchAPI<Building>('/buildings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Building>): Promise<ApiResponse<Building>> => {
    return fetchAPI<Building>(`/buildings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return fetchAPI<void>(`/buildings/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ BLOCK API ============
export const blockAPI = {
  getAll: async (buildingId?: string): Promise<ApiResponse<Block[]>> => {
    const endpoint = buildingId ? `/blocks?buildingId=${buildingId}` : '/blocks';
    return fetchAPI<Block[]>(endpoint);
  },

  getById: async (id: string): Promise<ApiResponse<Block>> => {
    return fetchAPI<Block>(`/blocks/${id}`);
  },

  create: async (data: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Block>> => {
    return fetchAPI<Block>('/blocks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Block>): Promise<ApiResponse<Block>> => {
    return fetchAPI<Block>(`/blocks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return fetchAPI<void>(`/blocks/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ FLOOR API ============
export const floorAPI = {
  getAll: async (blockId?: string): Promise<ApiResponse<Floor[]>> => {
    const endpoint = blockId ? `/floors?blockId=${blockId}` : '/floors';
    return fetchAPI<Floor[]>(endpoint);
  },

  getById: async (id: string): Promise<ApiResponse<Floor>> => {
    return fetchAPI<Floor>(`/floors/${id}`);
  },

  create: async (data: Omit<Floor, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Floor>> => {
    return fetchAPI<Floor>('/floors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Floor>): Promise<ApiResponse<Floor>> => {
    return fetchAPI<Floor>(`/floors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return fetchAPI<void>(`/floors/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ ROOM API ============
export const roomAPI = {
  getAll: async (floorId?: string): Promise<ApiResponse<Room[]>> => {
    const endpoint = floorId ? `/rooms?floorId=${floorId}` : '/rooms';
    return fetchAPI<Room[]>(endpoint);
  },

  getById: async (id: string): Promise<ApiResponse<Room>> => {
    return fetchAPI<Room>(`/rooms/${id}`);
  },

  create: async (data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Room>> => {
    return fetchAPI<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Room>): Promise<ApiResponse<Room>> => {
    return fetchAPI<Room>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return fetchAPI<void>(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ TENANT API ============
export const tenantAPI = {
  getAll: async (roomId?: string): Promise<ApiResponse<Tenant[]>> => {
    const endpoint = roomId ? `/tenants?roomId=${roomId}` : '/tenants';
    return fetchAPI<Tenant[]>(endpoint);
  },

  getById: async (id: string): Promise<ApiResponse<Tenant>> => {
    return fetchAPI<Tenant>(`/tenants/${id}`);
  },

  create: async (data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Tenant>> => {
    return fetchAPI<Tenant>('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Tenant>): Promise<ApiResponse<Tenant>> => {
    return fetchAPI<Tenant>(`/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    return fetchAPI<void>(`/tenants/${id}`, {
      method: 'DELETE',
    });
  },
};
