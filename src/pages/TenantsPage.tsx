// Tenants Page - Quản lý Khách thuê
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
import type { Tenant } from '../types';
import { TenantModal } from '../components/TenantModal';
import { ConfirmDialog } from '../components/ConfirmDialog';

const statusColors: Record<string, string> = {
  active: 'green',
  expired: 'red',
  pending: 'yellow',
};

const statusLabels: Record<string, string> = {
  active: 'Đang thuê',
  expired: 'Hết hạn',
  pending: 'Chờ xác nhận',
};

export function TenantsPage() {
  const { tenants, rooms, deleteTenant } = useRoomManagement();
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null);

  // Filter tenants
  const filteredTenants = tenants.filter(tenant => {
    const matchSearch = 
      tenant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery) ||
      (tenant.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchStatus = !filterStatus || tenant.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    onOpen();
  };

  const handleAdd = () => {
    setSelectedTenant(null);
    onOpen();
  };

  const handleDelete = (id: string) => {
    setTenantToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tenantToDelete) {
      deleteTenant(tenantToDelete);
      setTenantToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedTenant(null);
    onClose();
  };

  const getRoomNumber = (roomId: string) => {
    return rooms.find(r => r.id === roomId)?.roomNumber || 'N/A';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN');
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
        <Heading fontSize={{ base: '2xl', md: '3xl' }}>Quản lý Khách thuê</Heading>
        <Button 
          colorScheme="blue" 
          onClick={handleAdd}
          size={{ base: 'sm', md: 'md' }}
          w={{ base: 'full', sm: 'auto' }}
        >
          + Thêm Khách thuê
        </Button>
      </Flex>

      {/* Filters */}
      <Flex gap={3} mb={4} direction={{ base: 'column', md: 'row' }}>
        <Input
          placeholder="Tìm tên, số điện thoại, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxW={{ base: '100%', md: '400px' }}
          size={{ base: 'sm', md: 'md' }}
        />
        <Box
          as="select"
          value={filterStatus}
          onChange={(e: any) => setFilterStatus(e.target.value)}
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
          <option value="active">Đang thuê</option>
          <option value="expired">Hết hạn</option>
          <option value="pending">Chờ xác nhận</option>
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
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Họ tên</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Số điện thoại</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Email</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Phòng</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Ngày thuê</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold">Trạng thái</Table.ColumnHeader>
              <Table.ColumnHeader color="gray.700" fontWeight="semibold" textAlign="right">Thao tác</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredTenants.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={7}>
                  <Text textAlign="center" color="gray.500" py={8}>
                    Không có dữ liệu
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredTenants.map((tenant) => (
                <Table.Row key={tenant.id} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell fontWeight="medium" color="gray.800">{tenant.fullName}</Table.Cell>
                  <Table.Cell color="gray.700">{tenant.phone}</Table.Cell>
                  <Table.Cell color="gray.700">{tenant.email || '-'}</Table.Cell>
                  <Table.Cell color="gray.700">
                    <Badge colorScheme="blue">{getRoomNumber(tenant.roomId)}</Badge>
                  </Table.Cell>
                  <Table.Cell color="gray.700">{formatDate(tenant.moveInDate)}</Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={statusColors[tenant.status]}>
                      {statusLabels[tenant.status]}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Flex justify="flex-end" gap={2}>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => handleEdit(tenant)}
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleDelete(tenant.id)}
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
        {filteredTenants.length === 0 ? (
          <Box bg="white" p={8} borderRadius="md" textAlign="center">
            <Text color="gray.500">Không có dữ liệu</Text>
          </Box>
        ) : (
          filteredTenants.map((tenant) => (
            <Box
              key={tenant.id}
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
                  {tenant.fullName}
                </Text>
                <Badge colorScheme={statusColors[tenant.status]}>
                  {statusLabels[tenant.status]}
                </Badge>
              </Flex>
              <Text fontSize="sm" color="gray.700" mb={1}>
                📞 {tenant.phone}
              </Text>
              {tenant.email && (
                <Text fontSize="sm" color="gray.700" mb={1}>
                  ✉️ {tenant.email}
                </Text>
              )}
              <Text fontSize="sm" color="gray.700" mb={1}>
                🚪 Phòng: <Badge colorScheme="blue">{getRoomNumber(tenant.roomId)}</Badge>
              </Text>
              <Text fontSize="sm" color="gray.700" mb={1}>
                📅 Ngày thuê: {formatDate(tenant.moveInDate)}
              </Text>
              {tenant.idCard && (
                <Text fontSize="sm" color="gray.600" mb={2}>
                  🪪 CMND/CCCD: {tenant.idCard}
                </Text>
              )}
              <Flex gap={2} mt={3}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="outline"
                  flex={1}
                  onClick={() => handleEdit(tenant)}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  flex={1}
                  onClick={() => handleDelete(tenant.id)}
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
        <TenantModal
          isOpen={open}
          onClose={handleCloseModal}
          tenant={selectedTenant}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa Khách thuê"
        message="Bạn có chắc chắn muốn xóa khách thuê này? Hành động này không thể hoàn tác."
      />
    </Box>
  );
}
