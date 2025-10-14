// Blocks Page - Quản lý Block
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
import type { Block } from '../types';
import { BlockModal } from '../components/BlockModal';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function BlocksPage() {
  const { blocks, buildings, deleteBlock } = useRoomManagement();
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null);

  // Filter blocks
  const filteredBlocks = blocks.filter(block =>
    block.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (block: Block) => {
    setSelectedBlock(block);
    onOpen();
  };

  const handleAdd = () => {
    setSelectedBlock(null);
    onOpen();
  };

  const handleDelete = (id: string) => {
    setBlockToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (blockToDelete) {
      deleteBlock(blockToDelete);
      setBlockToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedBlock(null);
    onClose();
  };

  const getBuildingName = (buildingId: string) => {
    return buildings.find(b => b.id === buildingId)?.name || 'N/A';
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
        <Heading fontSize={{ base: '2xl', md: '3xl' }} color="gray.800">Quản lý Block</Heading>
        <Button 
          colorScheme="blue" 
          onClick={handleAdd}
          size={{ base: 'sm', md: 'md' }}
          w={{ base: 'full', sm: 'auto' }}
        >
          + Thêm Block
        </Button>
      </Flex>

      {/* Search */}
      <Box mb={4}>
        <Input
          placeholder="Tìm kiếm theo tên block..."
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
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Tên Block</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Căn hộ</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Số tầng</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold" display={{ base: 'none', lg: 'table-cell' }}>Mô tả</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold" textAlign="right">Thao tác</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredBlocks.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5}>
                  <Text textAlign="center" color="gray.500" py={8}>
                    Không có dữ liệu
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredBlocks.map((block) => (
                <Table.Row key={block.id} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell fontWeight="medium" color="gray.800">{block.name}</Table.Cell>
                  <Table.Cell color="gray.700">
                    <Badge colorScheme="blue">{getBuildingName(block.buildingId)}</Badge>
                  </Table.Cell>
                  <Table.Cell color="gray.700">{block.totalFloors} tầng</Table.Cell>
                  <Table.Cell color="gray.600" display={{ base: 'none', lg: 'table-cell' }}>{block.description || '-'}</Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex justify="flex-end" gap={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => handleEdit(block)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDelete(block.id)}
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
        {filteredBlocks.length === 0 ? (
          <Box bg="white" p={8} borderRadius="md" textAlign="center">
            <Text color="gray.500">Không có dữ liệu</Text>
          </Box>
        ) : (
          filteredBlocks.map((block) => (
            <Box
              key={block.id}
              bg="white"
              p={4}
              mb={3}
              borderRadius="md"
              boxShadow="sm"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Text fontWeight="bold" fontSize="lg" mb={2} color="gray.800">
                {block.name}
              </Text>
              <Text fontSize="sm" color="gray.700" mb={1}>
                🏢 Căn hộ: <Badge colorScheme="blue">{getBuildingName(block.buildingId)}</Badge>
              </Text>
              <Text fontSize="sm" color="gray.700" mb={1}>
                📊 Số tầng: {block.totalFloors}
              </Text>
              {block.description && (
                <Text fontSize="sm" color="gray.600" mb={3}>
                  {block.description}
                </Text>
              )}
              <Flex gap={2} mt={3}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  flex={1}
                  onClick={() => handleEdit(block)}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  flex={1}
                  onClick={() => handleDelete(block.id)}
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
        <BlockModal
          isOpen={open}
          onClose={handleCloseModal}
          block={selectedBlock}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa Block"
        message="Bạn có chắc chắn muốn xóa block này? Tất cả tầng và phòng trong block cũng sẽ bị xóa. Hành động này không thể hoàn tác."
      />
    </Box>
  );
}
