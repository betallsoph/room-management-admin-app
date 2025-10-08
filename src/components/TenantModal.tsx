// Tenant Modal - Form thêm/sửa khách thuê
import { Box, Button, Input } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import { useForm } from '../hooks';
import type { Tenant, TenantStatus } from '../types';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant?: Tenant | null;
}

export function TenantModal({ isOpen, onClose, tenant }: TenantModalProps) {
  const { addTenant, updateTenant, rooms } = useRoomManagement();
  
  const { values, handleChange, reset, setValues } = useForm({
    roomId: '',
    fullName: '',
    phone: '',
    email: '',
    idCard: '',
    dateOfBirth: '',
    hometown: '',
    moveInDate: new Date().toISOString().split('T')[0],
    moveOutDate: '',
    deposit: 0,
    monthlyRent: 0,
    status: 'active' as TenantStatus,
    notes: '',
  });

  useEffect(() => {
    if (tenant) {
      setValues({
        roomId: tenant.roomId,
        fullName: tenant.fullName,
        phone: tenant.phone,
        email: tenant.email || '',
        idCard: tenant.idCard || '',
        dateOfBirth: tenant.dateOfBirth ? new Date(tenant.dateOfBirth).toISOString().split('T')[0] : '',
        hometown: tenant.hometown || '',
        moveInDate: new Date(tenant.moveInDate).toISOString().split('T')[0],
        moveOutDate: tenant.moveOutDate ? new Date(tenant.moveOutDate).toISOString().split('T')[0] : '',
        deposit: tenant.deposit,
        monthlyRent: tenant.monthlyRent,
        status: tenant.status,
        notes: tenant.notes || '',
      });
    } else {
      reset();
    }
  }, [tenant, setValues, reset]);

  const handleSubmit = () => {
    const tenantData = {
      roomId: values.roomId,
      fullName: values.fullName,
      phone: values.phone,
      email: values.email || undefined,
      idCard: values.idCard,
      dateOfBirth: new Date(values.dateOfBirth),
      hometown: values.hometown || undefined,
      moveInDate: new Date(values.moveInDate),
      moveOutDate: values.moveOutDate ? new Date(values.moveOutDate) : undefined,
      deposit: values.deposit,
      monthlyRent: values.monthlyRent,
      status: values.status,
      notes: values.notes || undefined,
    };

    if (tenant) {
      updateTenant(tenant.id, tenantData);
    } else {
      addTenant(tenantData);
    }
    onClose();
  };

  if (!isOpen) return null;

  // Lọc phòng available
  const availableRooms = rooms.filter(r => 
    r.status === 'available' || (tenant && r.id === tenant.roomId)
  );

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
            {tenant ? 'Sửa Khách thuê' : 'Thêm Khách thuê mới'}
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
              Phòng
            </Box>
            <Box
              as="select"
              value={values.roomId}
              onChange={(e: any) => handleChange('roomId', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #E2E8F0',
                backgroundColor: 'white',
                color: '#1A202C',
              }}
            >
              <option value="">Chọn phòng</option>
              {availableRooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.roomNumber} - {room.price.toLocaleString()}đ/tháng
                </option>
              ))}
            </Box>
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Họ và tên
            </Box>
            <Input
              value={values.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Nguyễn Văn A"
              bg="white"
              borderColor="gray.300"
              color="gray.800"
              _placeholder={{ color: 'gray.400' }}
            />
          </Box>

          <Box mb={4} display="flex" gap={3}>
            <Box flex={1}>
              <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
                Số điện thoại
              </Box>
              <Input
                value={values.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="0901234567"
                bg="white"
                borderColor="gray.300"
                color="gray.800"
                _placeholder={{ color: 'gray.400' }}
              />
            </Box>

            <Box flex={1}>
              <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
                CMND/CCCD
              </Box>
              <Input
                value={values.idCard}
                onChange={(e) => handleChange('idCard', e.target.value)}
                placeholder="012345678"
                bg="white"
                borderColor="gray.300"
                color="gray.800"
                _placeholder={{ color: 'gray.400' }}
              />
            </Box>
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Email (tùy chọn)
            </Box>
            <Input
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@example.com"
              bg="white"
              borderColor="gray.300"
              color="gray.800"
              _placeholder={{ color: 'gray.400' }}
            />
          </Box>

          <Box mb={4} display="flex" gap={3}>
            <Box flex={1}>
              <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
                Ngày sinh
              </Box>
              <Input
                type="date"
                value={values.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                bg="white"
                borderColor="gray.300"
                color="gray.800"
              />
            </Box>

            <Box flex={1}>
              <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
                Quê quán
              </Box>
              <Input
                value={values.hometown}
                onChange={(e) => handleChange('hometown', e.target.value)}
                placeholder="Hà Nội"
                bg="white"
                borderColor="gray.300"
                color="gray.800"
                _placeholder={{ color: 'gray.400' }}
              />
            </Box>
          </Box>

          <Box mb={4} display="flex" gap={3}>
            <Box flex={1}>
              <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
                Tiền cọc (VNĐ)
              </Box>
              <Input
                type="number"
                value={values.deposit}
                onChange={(e) => handleChange('deposit', parseInt(e.target.value) || 0)}
                placeholder="3000000"
                bg="white"
                borderColor="gray.300"
                color="gray.800"
              />
            </Box>

            <Box flex={1}>
              <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
                Tiền thuê/tháng (VNĐ)
              </Box>
              <Input
                type="number"
                value={values.monthlyRent}
                onChange={(e) => handleChange('monthlyRent', parseInt(e.target.value) || 0)}
                placeholder="3000000"
                bg="white"
                borderColor="gray.300"
                color="gray.800"
              />
            </Box>
          </Box>

          <Box mb={4} display="flex" gap={3}>
            <Box flex={1}>
              <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
                Ngày thuê
              </Box>
              <Input
                type="date"
                value={values.moveInDate}
                onChange={(e) => handleChange('moveInDate', e.target.value)}
                bg="white"
                borderColor="gray.300"
                color="gray.800"
              />
            </Box>

            <Box flex={1}>
              <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
                Ngày trả (tùy chọn)
              </Box>
              <Input
                type="date"
                value={values.moveOutDate}
                onChange={(e) => handleChange('moveOutDate', e.target.value)}
                bg="white"
                borderColor="gray.300"
                color="gray.800"
              />
            </Box>
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Trạng thái
            </Box>
            <Box
              as="select"
              value={values.status}
              onChange={(e: any) => handleChange('status', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #E2E8F0',
                backgroundColor: 'white',
                color: '#1A202C',
              }}
            >
              <option value="active">Đang thuê</option>
              <option value="expired">Hết hạn</option>
              <option value="pending">Chờ xác nhận</option>
            </Box>
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
              Ghi chú
            </Box>
            <Input
              value={values.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Thông tin thêm..."
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
            {tenant ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Box>
      </Box>
    </>
  );
}
