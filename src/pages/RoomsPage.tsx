// Rooms Page - Quản lý Phòng
import {
  Box,
  Button,
  Heading,
  Table,
  Flex,
  Text,
  Input,
  useDisclosure,
  Badge,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import type { Room } from '../types';
import { RoomModal } from '../components/RoomModal';
import { ConfirmDialog } from '../components/ConfirmDialog';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const statusColors: Record<string, string> = {
  available: 'green',
  occupied: 'blue',
  maintenance: 'yellow',
  reserved: 'purple',
};

const statusLabels: Record<string, string> = {
  available: 'Trống',
  occupied: 'Đã cho thuê',
  maintenance: 'Bảo trì',
  reserved: 'Đã đặt',
};

export function RoomsPage() {
  const { rooms, blocks, deleteRoom } = useRoomManagement();
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !filterStatus || room.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    onOpen();
  };

  const handleAdd = () => {
    setSelectedRoom(null);
    onOpen();
  };

  const handleDelete = (id: string) => {
    setRoomToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (roomToDelete) {
      deleteRoom(roomToDelete);
      setRoomToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    onClose();
  };

  const getBlockName = (blockId: string) => {
    return blocks.find(b => b.id === blockId)?.name || 'N/A';
  };

  return (
    <Box>
      <Flex 
        justify="space-between" 
        align="center" 
        mb={{ base: 4, md: 6 }}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 3, sm: 0 }}
      >
        <Heading fontSize={{ base: '2xl', md: '3xl' }} color="gray.800">Quản lý Phòng</Heading>
        <Button 
          colorScheme="blue" 
          onClick={handleAdd}
          size={{ base: 'sm', md: 'md' }}
          w={{ base: 'full', sm: 'auto' }}
        >
          + Thêm Phòng
        </Button>
      </Flex>

      {/* Filters */}
      <Flex gap={3} mb={4} direction={{ base: 'column', md: 'row' }}>
        <Input
          placeholder="Tìm kiếm phòng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxW={{ base: '100%', md: '300px' }}
          size={{ base: 'sm', md: 'md' }}
        />
        <Box
          as="select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '0.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #E2E8F0',
            backgroundColor: 'white',
            color: '#1A202C',
            maxWidth: '200px',
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="available">Trống</option>
          <option value="occupied">Đã cho thuê</option>
          <option value="maintenance">Bảo trì</option>
          <option value="reserved">Đã đặt</option>
        </Box>
      </Flex>

      {/* Table - Desktop */}
      <Box 
        bg="white" 
        borderRadius="md" 
        overflow={{ base: 'auto', md: 'hidden' }} 
        boxShadow="sm"
        display={{ base: 'none', lg: 'block' }}
      >
        <Table.Root>
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Số phòng</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Block</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Diện tích</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Giá thuê</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Trạng thái</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold" textAlign="right">Thao tác</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredRooms.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <Text textAlign="center" color="gray.500" py={8}>
                    Không có dữ liệu
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredRooms.map((room) => (
                <Table.Row key={room.id} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell fontWeight="medium" color="gray.800">{room.roomNumber}</Table.Cell>
                  <Table.Cell color="gray.700">
                    <Badge colorScheme="purple">{getBlockName(room.blockId)}</Badge>
                  </Table.Cell>
                  <Table.Cell color="gray.700">{room.area}m²</Table.Cell>
                  <Table.Cell color="gray.700" fontWeight="medium">{formatPrice(room.price)}</Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={statusColors[room.status]}>
                      {statusLabels[room.status]}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex justify="flex-end" gap={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => handleEdit(room)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDelete(room.id)}
                      >
                        Xóa
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Card View - Mobile/Tablet */}
      <Box display={{ base: 'block', lg: 'none' }}>
        {filteredRooms.length === 0 ? (
          <Box bg="white" p={8} borderRadius="md" textAlign="center">
            <Text color="gray.500">Không có dữ liệu</Text>
          </Box>
        ) : (
          filteredRooms.map((room) => (
            <Box
              key={room.id}
              bg="white"
              p={4}
              mb={3}
              borderRadius="md"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Flex justify="space-between" align="start" mb={2}>
                <Text fontWeight="bold" fontSize="lg" color="gray.800">
                  {room.roomNumber}
                </Text>
                <Badge colorScheme={statusColors[room.status]}>
                  {statusLabels[room.status]}
                </Badge>
              </Flex>
              <Text fontSize="sm" color="gray.700" mb={1}>
                🏗️ Block: <Badge colorScheme="purple">{getBlockName(room.blockId)}</Badge>
              </Text>
              <Text fontSize="sm" color="gray.700" mb={1}>
                📏 Diện tích: {room.area}m²
              </Text>
              <Text fontSize="sm" color="gray.700" mb={1} fontWeight="semibold">
                💰 {formatPrice(room.price)}/tháng
              </Text>
              {room.amenities && room.amenities.length > 0 && (
                <Text fontSize="sm" color="gray.600" mb={2}>
                  🛋️ {room.amenities.join(', ')}
                </Text>
              )}
              <Flex gap={2} mt={3}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  flex={1}
                  onClick={() => handleEdit(room)}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  flex={1}
                  onClick={() => handleDelete(room.id)}
                >
                  Xóa
                </Button>
              </Flex>
            </Box>
          ))
        )}
      </Box>

      {/* Modal */}
      {open && (
        <RoomModal
          isOpen={open}
          onClose={handleCloseModal}
          room={selectedRoom}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa Phòng"
        message="Bạn có chắc chắn muốn xóa phòng này? Tất cả thông tin khách thuê liên quan sẽ bị xóa. Hành động này không thể hoàn tác."
      />
    </Box>
  );
}
