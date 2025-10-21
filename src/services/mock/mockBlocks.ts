import type { Block } from '../../types';

export const mockBlocks: Block[] = [
  {
    id: '1',
    buildingId: '1',
    name: 'Block A1',
    description: '25 tầng, mỗi tầng 6 phòng (A1-<tầng>-<phòng>)',
    totalRooms: 150,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    buildingId: '1',
    name: 'Block A2',
    description: '25 tầng, mỗi tầng 6 phòng (A2-<tầng>-<phòng>)',
    totalRooms: 150,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];


