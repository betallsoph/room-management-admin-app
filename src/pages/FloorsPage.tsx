import { Box, Heading, Table, Text, Badge } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import { RoomStatus } from '../types';

export function FloorsPage() {
  const { blocks, rooms } = useRoomManagement();
  const [selectedBlockId, setSelectedBlockId] = useState<string>(blocks[0]?.id || '');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);

  const floors = useMemo(() => {
    if (!selectedBlockId) return [] as Array<{ floor: number; total: number; available: number; occupied: number; maintenance: number; reserved: number }>;
    const blockRooms = rooms.filter(r => r.blockId === selectedBlockId);
    const floorMap = new Map<number, { floor: number; total: number; available: number; occupied: number; maintenance: number; reserved: number }>();
    for (const room of blockRooms) {
      const match = room.roomNumber.match(/^[a-z]+\d+-(\d{2})-\d{2}$/i);
      const floor = match ? parseInt(match[1], 10) : 0;
      if (!floorMap.has(floor)) {
        floorMap.set(floor, { floor, total: 0, available: 0, occupied: 0, maintenance: 0, reserved: 0 });
      }
      const entry = floorMap.get(floor)!;
      entry.total += 1;
      if (room.status === RoomStatus.AVAILABLE) entry.available += 1;
      else if (room.status === RoomStatus.OCCUPIED) entry.occupied += 1;
      else if (room.status === RoomStatus.MAINTENANCE) entry.maintenance += 1;
      else if (room.status === RoomStatus.RESERVED) entry.reserved += 1;
    }
    return Array.from(floorMap.values()).sort((a, b) => a.floor - b.floor);
  }, [rooms, selectedBlockId]);

  const roomsOfSelected = useMemo(() => {
    if (!selectedBlockId || !selectedFloor) return [] as typeof rooms;
    const floorStr = String(selectedFloor).padStart(2, '0');
    return rooms.filter(r => r.blockId === selectedBlockId && new RegExp(`^[a-z]+\\d+-${floorStr}-\\d{2}$`, 'i').test(r.roomNumber));
  }, [rooms, selectedBlockId, selectedFloor]);

  return (
    <Box>
      <Heading fontSize={{ base: 'xl', md: '2xl' }} mb={4}>Quản lý tầng</Heading>

      <Box mb={4} maxW={{ base: 'full', md: '320px' }}>
        <Box
          as="select"
          value={selectedBlockId}
          onChange={(e: any) => { setSelectedBlockId(e.target.value); setSelectedFloor(1); }}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #E2E8F0',
            backgroundColor: 'white',
            color: '#1A202C',
          }}
        >
          {blocks.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </Box>
      </Box>

      <Box mb={4} maxW={{ base: 'full', md: '320px' }}>
        <Box
          as="select"
          value={selectedFloor}
          onChange={(e: any) => setSelectedFloor(Number(e.target.value))}
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #E2E8F0',
            backgroundColor: 'white',
            color: '#1A202C',
          }}
        >
          {floors.map(f => (
            <option key={f.floor} value={f.floor}>Tầng {f.floor}</option>
          ))}
        </Box>
      </Box>

      {/* Stats table removed per request */}

      <Heading fontSize={{ base: 'lg', md: 'xl' }} mb={3}>Phòng tầng {selectedFloor}</Heading>
      <Box bg="white" borderRadius="md" overflow={{ base: 'auto', md: 'hidden' }} boxShadow="sm">
        <Table.Root>
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Mã phòng</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Diện tích (m²)</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Sức chứa</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Giá</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Trạng thái</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {roomsOfSelected.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Text textAlign="center" color="gray.500" py={8}>Không có phòng</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              roomsOfSelected
                .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
                .map(room => (
                <Table.Row key={room.id} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell fontWeight="medium" color="gray.800">{room.roomNumber.toUpperCase()}</Table.Cell>
                  <Table.Cell color="gray.700">{room.area}</Table.Cell>
                  <Table.Cell color="gray.700">{room.capacity}</Table.Cell>
                  <Table.Cell color="gray.700">{new Intl.NumberFormat('vi-VN').format(room.price)}</Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={
                      room.status === RoomStatus.AVAILABLE ? 'green' :
                      room.status === RoomStatus.OCCUPIED ? 'blue' :
                      room.status === RoomStatus.MAINTENANCE ? 'orange' : 'purple'
                    }>
                      {room.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}


