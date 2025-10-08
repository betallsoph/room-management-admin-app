// Block Modal - Form thêm/sửa block
import { Box, Button, Input, Textarea, Select } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import { useForm } from '../hooks';
import type { Block } from '../types';

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  block?: Block | null;
}

export function BlockModal({ isOpen, onClose, block }: BlockModalProps) {
  const { addBlock, updateBlock, buildings } = useRoomManagement();
  
  const { values, handleChange, reset, setValues } = useForm({
    buildingId: '',
    name: '',
    description: '',
    totalFloors: 0,
  });

  useEffect(() => {
    if (block) {
      setValues({
        buildingId: block.buildingId,
        name: block.name,
        description: block.description || '',
        totalFloors: block.totalFloors,
      });
    } else {
      reset();
    }
  }, [block, setValues, reset]);

  const handleSubmit = () => {
    if (block) {
      updateBlock(block.id, values);
    } else {
      addBlock(values);
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
        maxW={{ base: '90%', md: '500px' }}
        w="full"
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
        >
          <Box fontSize="lg" fontWeight="semibold" color="gray.800">
            {block ? 'Sửa Block' : 'Thêm Block mới'}
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
              Căn hộ
            </Box>
            <Select
              value={values.buildingId}
              onChange={(e) => handleChange('buildingId', e.target.value)}
              placeholder="Chọn căn hộ"
              bg="white"
              borderColor="gray.300"
              color="gray.800"
            >
              {buildings.map(building => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </Select>
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Tên Block
            </Box>
            <Input
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="VD: Block A1"
              bg="white"
              borderColor="gray.300"
              color="gray.800"
              _placeholder={{ color: 'gray.400' }}
            />
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Số tầng
            </Box>
            <Input
              type="number"
              value={values.totalFloors}
              onChange={(e) => handleChange('totalFloors', parseInt(e.target.value) || 0)}
              placeholder="25"
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
              placeholder="Mô tả về block..."
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
        >
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {block ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Box>
      </Box>
    </>
  );
}
