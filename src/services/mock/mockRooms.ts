import type { Room } from '../../types';

function generateRoomsForBlock(
  blockId: '1' | '2',
  blockCode: 'a1' | 'a2',
  startRoomNum: number // e.g. a1: 1, a2: 7
): Room[] {
  const rooms: Room[] = [];
  let idCounter = blockId === '1' ? 1 : 1001; // ensure unique ids across blocks
  for (let floor = 1; floor <= 25; floor++) {
    for (let offset = 0; offset < 6; offset++) {
      const num = startRoomNum + offset; // a1: 1..6, a2: 7..12
      const roomId = (idCounter++).toString();
      const roomNumber = `${blockCode}-${String(floor).padStart(2, '0')}-${String(num).padStart(2, '0')}`;
      const area = 22 + ((floor + num) % 10); // 22-31 m2
      const capacity = (num % 3 === 0) ? 3 : 2;
      const price = 2700000 + ((floor % 5) * 100000) + ((num % 3) * 100000);
      const statusPool: Room['status'][] = ['available', 'occupied', 'maintenance', 'reserved'];
      const status = statusPool[(floor + num) % statusPool.length];
      const amenitiesPool = ['Điều hòa', 'Nóng lạnh', 'Giường', 'Tủ lạnh', 'Máy giặt', 'Ban công', 'Bếp', 'WC riêng'];
      const amenities = amenitiesPool.filter((_, idx) => ((floor + num + idx) % 2) === 0);

      rooms.push({
        id: roomId,
        blockId,
        roomNumber,
        name: `Phòng ${blockCode.toUpperCase()}-${String(floor).padStart(2, '0')}-${String(num).padStart(2, '0')}`,
        area,
        capacity,
        price,
        status,
        amenities,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      });
    }
  }
  return rooms;
}

export const mockRooms: Room[] = [
  ...generateRoomsForBlock('1', 'a1', 1),   // A1: 01..06
  ...generateRoomsForBlock('2', 'a2', 7),   // A2: 07..12
];


