// Buildings Page - Quản lý căn hộ
import {
  Box,
  Button,
  Heading,
  Table,
  Flex,
  Text,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import type { Building } from '../types';
import { BuildingModal } from '../components/BuildingModal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function BuildingsPage() {
  const { buildings, deleteBuilding } = useRoomManagement();
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<string | null>(null);

  // Filter buildings
  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    building.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (building: Building) => {
    setSelectedBuilding(building);
    onOpen();
  };

  const handleAdd = () => {
    setSelectedBuilding(null);
    onOpen();
  };

  const handleDelete = (id: string) => {
    setBuildingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (buildingToDelete) {
      deleteBuilding(buildingToDelete);
      setBuildingToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedBuilding(null);
    onClose();
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
        <Heading fontSize={{ base: '2xl', md: '3xl' }} color="gray.800">Quản lý căn hộ</Heading>
        <Button 
          colorScheme="blue" 
          onClick={handleAdd}
          size={{ base: 'sm', md: 'md' }}
          w={{ base: 'full', sm: 'auto' }}
        >
          + Thêm căn hộ
        </Button>
      </Flex>

      {/* Search */}
      <Box mb={4}>
        <Input
          placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxW={{ base: '100%', md: '400px' }}
          size={{ base: 'sm', md: 'md' }}
        />
      </Box>

      {/* Table - Desktop */}
      <Box 
        bg="white" 
        borderRadius="md" 
        overflow={{ base: 'auto', md: 'hidden' }} 
        boxShadow="sm"
        display={{ base: 'none', md: 'block' }}
      >
        <Table.Root>
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Tên căn hộ</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Địa chỉ</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Số Block</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold" display={{ base: 'none', lg: 'table-cell' }}>Mô tả</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold" textAlign="right">Thao tác</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredBuildings.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Text textAlign="center" color="gray.500" py={8}>
                    Không có dữ liệu
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredBuildings.map((building) => (
                <Table.Row key={building.id} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell fontWeight="medium" color="gray.800">{building.name}</Table.Cell>
                  <Table.Cell color="gray.700">{building.address}</Table.Cell>
                  <Table.Cell color="gray.700">{building.totalBlocks}</Table.Cell>
                  <Table.Cell color="gray.600" display={{ base: 'none', lg: 'table-cell' }}>{building.description || '-'}</Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex justify="flex-end" gap={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => handleEdit(building)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDelete(building.id)}
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

      {/* Card View - Mobile */}
      <Box display={{ base: 'block', md: 'none' }}>
        {filteredBuildings.length === 0 ? (
          <Box bg="white" p={8} borderRadius="md" textAlign="center">
            <Text color="gray.500">Không có dữ liệu</Text>
          </Box>
        ) : (
          filteredBuildings.map((building) => (
            <Box
              key={building.id}
              bg="white"
              p={4}
              mb={3}
              borderRadius="md"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Text fontWeight="bold" fontSize="lg" mb={2} color="gray.800">
                {building.name}
              </Text>
              <Text fontSize="sm" color="gray.700" mb={1}>
                📍 {building.address}
              </Text>
              <Text fontSize="sm" color="gray.700" mb={1}>
                🏢 Số Block: {building.totalBlocks}
              </Text>
              {building.description && (
                <Text fontSize="sm" color="gray.600" mb={3}>
                  {building.description}
                </Text>
              )}
              <Flex gap={2} mt={3}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  flex={1}
                  onClick={() => handleEdit(building)}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  flex={1}
                  onClick={() => handleDelete(building.id)}
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
        <BuildingModal
          isOpen={open}
          onClose={handleCloseModal}
          building={selectedBuilding}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa căn hộ"
        message="Bạn có chắc chắn muốn xóa căn hộ này? Tất cả dữ liệu liên quan (blocks, tầng, phòng) cũng sẽ bị xóa. Hành động này không thể hoàn tác."
      />
    </Box>
  );
}
