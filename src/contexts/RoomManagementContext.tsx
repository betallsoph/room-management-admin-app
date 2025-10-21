// Room Management Context - Quản lý state toàn app
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Building, Block, Room, Tenant, Notification } from '../types';
import { mockBuildings, mockBlocks, mockRooms, mockTenants } from '../services/mockData';

interface RoomManagementContextType {
  // State
  buildings: Building[];
  blocks: Block[];
  rooms: Room[];
  tenants: Tenant[];
  notifications: Notification[];
  
  // Buildings
  addBuilding: (building: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBuilding: (id: string, data: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
  getBuildingById: (id: string) => Building | undefined;
  
  // Blocks
  addBlock: (block: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBlock: (id: string, data: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  getBlocksByBuildingId: (buildingId: string) => Block[];
  
  // Rooms
  addRoom: (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  getRoomsByBlockId: (blockId: string) => Room[];
  
  // Tenants
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTenant: (id: string, data: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  getTenantsByRoomId: (roomId: string) => Tenant[];

  // Notifications
  addNotification: (data: Omit<Notification, 'id' | 'createdAt'>) => void;
}

const RoomManagementContext = createContext<RoomManagementContextType | undefined>(undefined);

// Provider component
export function RoomManagementProvider({ children }: { children: ReactNode }) {
  // State - Khởi tạo với mock data, sau này sẽ fetch từ API
  const [buildings, setBuildings] = useState<Building[]>(mockBuildings);
  const [blocks, setBlocks] = useState<Block[]>(mockBlocks);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ============ BUILDING OPERATIONS ============
  const addBuilding = useCallback((buildingData: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBuilding: Building = {
      ...buildingData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBuildings(prev => [...prev, newBuilding]);
  }, []);

  const updateBuilding = useCallback((id: string, data: Partial<Building>) => {
    setBuildings(prev => prev.map(building => 
      building.id === id 
        ? { ...building, ...data, updatedAt: new Date() }
        : building
    ));
  }, []);

  const deleteBuilding = useCallback((id: string) => {
    setBuildings(prev => prev.filter(building => building.id !== id));
    // Cascade delete: xóa tất cả blocks liên quan
    setBlocks(prev => prev.filter(block => block.buildingId !== id));
  }, []);

  const getBuildingById = useCallback((id: string) => {
    return buildings.find(b => b.id === id);
  }, [buildings]);

  // ============ BLOCK OPERATIONS ============
  const addBlock = useCallback((blockData: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBlock: Block = {
      ...blockData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBlocks(prev => [...prev, newBlock]);
  }, []);

  const updateBlock = useCallback((id: string, data: Partial<Block>) => {
    setBlocks(prev => prev.map(block => 
      block.id === id 
        ? { ...block, ...data, updatedAt: new Date() }
        : block
    ));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
    // Cascade delete: xóa tất cả rooms liên quan
    setRooms(prev => prev.filter(room => room.blockId !== id));
  }, []);

  const getBlocksByBuildingId = useCallback((buildingId: string) => {
    return blocks.filter(block => block.buildingId === buildingId);
  }, [blocks]);

  // ============ ROOM OPERATIONS ============
  const addRoom = useCallback((roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoom: Room = {
      ...roomData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRooms(prev => [...prev, newRoom]);
  }, []);

  const updateRoom = useCallback((id: string, data: Partial<Room>) => {
    setRooms(prev => prev.map(room => 
      room.id === id 
        ? { ...room, ...data, updatedAt: new Date() }
        : room
    ));
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
    // Cascade delete: xóa tất cả tenants liên quan
    setTenants(prev => prev.filter(tenant => tenant.roomId !== id));
  }, []);

  const getRoomsByBlockId = useCallback((blockId: string) => {
    return rooms.filter(room => room.blockId === blockId);
  }, [rooms]);

  // ============ TENANT OPERATIONS ============
  const addTenant = useCallback((tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTenant: Tenant = {
      ...tenantData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTenants(prev => [...prev, newTenant]);
  }, []);

  const updateTenant = useCallback((id: string, data: Partial<Tenant>) => {
    setTenants(prev => prev.map(tenant => 
      tenant.id === id 
        ? { ...tenant, ...data, updatedAt: new Date() }
        : tenant
    ));
  }, []);

  const deleteTenant = useCallback((id: string) => {
    setTenants(prev => prev.filter(tenant => tenant.id !== id));
  }, []);

  const getTenantsByRoomId = useCallback((roomId: string) => {
    return tenants.filter(tenant => tenant.roomId === roomId);
  }, [tenants]);

  // ============ NOTIFICATION OPERATIONS ============
  const addNotification = useCallback((data: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const value: RoomManagementContextType = {
    buildings,
    blocks,
    rooms,
    tenants,
    notifications,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    getBuildingById,
    addBlock,
    updateBlock,
    deleteBlock,
    getBlocksByBuildingId,
    addRoom,
    updateRoom,
    deleteRoom,
    getRoomsByBlockId,
    addTenant,
    updateTenant,
    deleteTenant,
    getTenantsByRoomId,
    addNotification,
  };

  return (
    <RoomManagementContext.Provider value={value}>
      {children}
    </RoomManagementContext.Provider>
  );
}

// Custom hook để sử dụng context
export function useRoomManagement() {
  const context = useContext(RoomManagementContext);
  if (context === undefined) {
    throw new Error('useRoomManagement must be used within RoomManagementProvider');
  }
  return context;
}
