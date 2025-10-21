import { Box, Button, Card, Heading, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import { NotificationModal } from '../components/NotificationModal';

export function NotificationsPage() {
  const { notifications } = useRoomManagement();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={{ base: 4, md: 6 }} flexDir={{ base: 'column', sm: 'row' }} gap={{ base: 3, sm: 0 }}>
        <Heading fontSize={{ base: '2xl', md: '3xl' }} color="gray.800">Thông báo</Heading>
        <Button colorScheme="blue" onClick={() => setIsOpen(true)} w={{ base: 'full', sm: 'auto' }}>Tạo thông báo</Button>
      </Box>

      <Stack gap={4}>
        {notifications.length === 0 && (
          <Box color="gray.600">Chưa có thông báo nào.</Box>
        )}
        {notifications.map(n => (
          <Card.Root key={n.id}>
            <Card.Body p={{ base: 4, md: 6 }}>
              <Text fontWeight="semibold" fontSize="lg" color="gray.800">{n.title}</Text>
              <Text mt={1} color="gray.700">{n.content}</Text>
              <Text mt={2} fontSize="sm" color="gray.500">Gửi: {formatTarget(n.targetType)}</Text>
              <Text mt={1} fontSize="xs" color="gray.400">{new Date(n.createdAt).toLocaleString('vi-VN')}</Text>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>

      <NotificationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
}

function formatTarget(type: string) {
  switch (type) {
    case 'all':
      return 'Tất cả';
    case 'building':
      return 'Theo tòa nhà';
    case 'block':
      return 'Theo block';
    case 'room':
      return 'Theo phòng';
    case 'tenant':
      return 'Theo khách';
    default:
      return type;
  }
}


