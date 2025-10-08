// Room Modal - Form thêm/sửa phòng
import { Box, Button, Input, Textarea, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import { useForm } from '../hooks';
import type { Room } from '../types';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: Room | null;
}

export function RoomModal({ isOpen, onClose, room }: RoomModalProps) {
  const { addRoom, updateRoom, blocks } = useRoomManagement();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Helper to extract blockId and roomNumber from name (e.g., "A1-01" -> blockId for "Block A1", roomNumber "a1-01")
  const parseRoomName = (name: string) => {
    const match = name.match(/^([A-Za-z]+\d+)-(.+)$/);
    if (match) {
      const blockName = match[1]; // e.g., "A1"
      const roomNum = match[2]; // e.g., "01"
      const block = blocks.find(b => 
        b.name.toLowerCase().replace(/\s+/g, '') === `block${blockName.toLowerCase()}`
      );
      return {
        blockId: block?.id || '',
        roomNumber: `${blockName.toLowerCase()}-${roomNum}` // e.g., "a1-01"
      };
    }
    return { blockId: '', roomNumber: name.toLowerCase() };
  };
  
  const { values, handleChange, reset, setValues } = useForm({
    blockId: '',
    roomNumber: '',
    name: '',
    area: 25,
    capacity: 2,
    price: 3000000,
    status: 'available' as const,
    description: '',
  });

  useEffect(() => {
    if (room) {
      setValues({
        blockId: room.blockId,
        roomNumber: room.roomNumber,
        name: room.name,
        area: room.area,
        capacity: room.capacity,
        price: room.price,
        status: room.status as 'available',
        description: room.description || '',
      });
      setSelectedAmenities(room.amenities || []);
    } else {
      reset();
      setSelectedAmenities([]);
    }
  }, [room, setValues, reset]);

  const amenitiesList = [
    'Điều hòa',
    'Nóng lạnh',
    'Giường',
    'Tủ lạnh',
    'Máy giặt',
    'Ban công',
    'Bếp',
    'WC riêng',
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

    const handleSubmit = () => {
    const { blockId, roomNumber } = parseRoomName(values.name);
    const roomData = {
      ...values,
      blockId,
      roomNumber,
      amenities: selectedAmenities,
    };

    if (room) {
      updateRoom(room.id, roomData);
    } else {
      addRoom(roomData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="blackAlpha.600"
        zIndex="1000"
        onClick={onClose}
      />

      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        maxW={{ base: '90%', md: '600px' }}
        w="full"
        maxH="90vh"
        overflowY="auto"
        zIndex="1001"
        color="gray.800"
      >
        <Box
          px={6}
          py={4}
          borderBottom="1px"
          borderColor="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          position="sticky"
          top="0"
          bg="white"
          zIndex="10"
        >
          <Box fontSize="lg" fontWeight="semibold" color="gray.800">
            {room ? 'Sửa Phòng' : 'Thêm Phòng mới'}
          </Box>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            color="gray.500"
            _hover={{ bg: 'gray.100' }}
          >
            ✕
          </Button>
        </Box>

        <Box px={6} py={6}>
          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Tên phòng
            </Box>
            <Input
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="VD: A1-01 (Block A1, Phòng 01)"
              bg="white"
              borderColor="gray.300"
              color="gray.800"
              _placeholder={{ color: 'gray.400' }}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Format: BlockX-YY (ví dụ: A1-01, A2-16)
            </Text>
          </Box>

          <Box mb={4} display="none">
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              (Hidden fields)
            </Box>
            <Input
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="VD: Phòng A1-01"
              bg="white"
              borderColor="gray.300"
              color="gray.800"
              _placeholder={{ color: 'gray.400' }}
            />
          </Box>

          <Box mb={4} display="flex" gap={3}>
            <Box flex={1}>
              <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
                Diện tích (m²)
              </Box>
              <Input
                type="number"
                value={values.area}
                onChange={(e) => handleChange('area', parseFloat(e.target.value) || 0)}
                placeholder="25"
                bg="white"
                borderColor="gray.300"
                color="gray.800"
              />
            </Box>

            <Box flex={1}>
              <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
                Sức chứa (người)
              </Box>
              <Input
                type="number"
                value={values.capacity}
                onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
                placeholder="2"
                bg="white"
                borderColor="gray.300"
                color="gray.800"
              />
            </Box>
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Giá thuê (VNĐ)
            </Box>
            <Input
              type="number"
              value={values.price}
              onChange={(e) => handleChange('price', parseInt(e.target.value) || 0)}
              placeholder="3000000"
              bg="white"
              borderColor="gray.300"
              color="gray.800"
            />
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Trạng thái
            </Box>
            <Box
              as="select"
              value={values.status}
              onChange={(e) => handleChange('status', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #E2E8F0',
                backgroundColor: 'white',
                color: '#1A202C',
              }}
            >
              <option value="available">Trống</option>
              <option value="occupied">Đã cho thuê</option>
              <option value="maintenance">Bảo trì</option>
              <option value="reserved">Đã đặt</option>
            </Box>
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Tiện nghi
            </Box>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {amenitiesList.map(amenity => (
                <Button
                  key={amenity}
                  size="sm"
                  variant={selectedAmenities.includes(amenity) ? 'solid' : 'outline'}
                  colorScheme={selectedAmenities.includes(amenity) ? 'blue' : 'gray'}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Button>
              ))}
            </Box>
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Mô tả
            </Box>
            <Textarea
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Thông tin mô tả phòng..."
              rows={3}
              bg="white"
              borderColor="gray.300"
              color="gray.800"
              _placeholder={{ color: 'gray.400' }}
            />
          </Box>
        </Box>

        <Box
          px={6}
          py={4}
          borderTop="1px"
          borderColor="gray.200"
          display="flex"
          justifyContent="flex-end"
          gap={3}
          position="sticky"
          bottom="0"
          bg="white"
        >
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {room ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Box>
      </Box>
    </>
  );
}
