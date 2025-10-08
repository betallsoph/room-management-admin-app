// Building Modal - Form thêm/sửa căn hộ
import { Box, Button, Input, Textarea } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import { useForm } from '../hooks';
import type { Building } from '../types';

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  building?: Building | null;
}

export function BuildingModal({ isOpen, onClose, building }: BuildingModalProps) {
  const { addBuilding, updateBuilding } = useRoomManagement();
  
  const { values, handleChange, reset, setValues } = useForm({
    name: '',
    address: '',
    description: '',
    totalBlocks: 0,
  });

  // Load dữ liệu khi edit
  useEffect(() => {
    if (building) {
      setValues({
        name: building.name,
        address: building.address,
        description: building.description || '',
        totalBlocks: building.totalBlocks,
      });
    } else {
      reset();
    }
  }, [building, setValues, reset]);

  const handleSubmit = () => {
    if (building) {
      // Update
      updateBuilding(building.id, values);
    } else {
      // Create
      addBuilding(values);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
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

      {/* Modal */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        maxW={{ base: '90%', md: '500px' }}
        w="full"
        zIndex="1001"
        color="gray.800"
      >
        {/* Header */}
        <Box
          px={6}
          py={4}
          borderBottom="1px"
          borderColor="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box fontSize="lg" fontWeight="semibold" color="gray.800">
            {building ? 'Sửa căn hộ' : 'Thêm căn hộ mới'}
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

        {/* Body */}
        <Box px={6} py={6}>
          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Tên căn hộ
            </Box>
            <Input
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="VD: Căn hộ Sunrise"
              bg="white"
              borderColor="gray.300"
              color="gray.800"
              _placeholder={{ color: 'gray.400' }}
            />
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Địa chỉ
            </Box>
            <Input
              value={values.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="VD: 123 Nguyễn Văn Linh, Q7"
              bg="white"
              borderColor="gray.300"
              color="gray.800"
              _placeholder={{ color: 'gray.400' }}
            />
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Số lượng Block
            </Box>
            <Input
              type="number"
              value={values.totalBlocks}
              onChange={(e) => handleChange('totalBlocks', parseInt(e.target.value) || 0)}
              placeholder="0"
              bg="white"
              borderColor="gray.300"
              color="gray.800"
              _placeholder={{ color: 'gray.400' }}
            />
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Mô tả (tùy chọn)
            </Box>
            <Textarea
              value={values.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Mô tả về căn hộ..."
              rows={3}
              bg="white"
              borderColor="gray.300"
              color="gray.800"
              _placeholder={{ color: 'gray.400' }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          px={6}
          py={4}
          borderTop="1px"
          borderColor="gray.200"
          display="flex"
          justifyContent="flex-end"
          gap={3}
        >
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {building ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Box>
      </Box>
    </>
  );
}
