import { Box, Button, Input, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import type { NotificationTargetType } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const { buildings, blocks, rooms, tenants, addNotification } = useRoomManagement();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetType, setTargetType] = useState<NotificationTargetType>('all');
  const [targetIds, setTargetIds] = useState<string[]>([]);

  const focusOnMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    // Force focus target on mousedown to avoid needing a second click while typing in another field
    (e.currentTarget as HTMLElement).focus();
  };

  const reset = () => {
    setTitle('');
    setContent('');
    setTargetType('all');
    setTargetIds([]);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    addNotification({ title: title.trim(), content: content.trim(), targetType, targetIds: targetIds.length ? targetIds : undefined });
    reset();
    onClose();
  };

  const renderTargetSelect = () => {
    if (targetType === 'all') return null;
    if (targetType === 'building') {
      return (
        <Box mb={4}>
          <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
            Chọn tòa nhà
          </Box>
          <Box
            as="select"
            value={targetIds[0] || ''}
            onChange={(e) => setTargetIds(e.target.value ? [e.target.value] : [])}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #E2E8F0', backgroundColor: 'white', color: '#1A202C' }}
          >
            <option value="">-- Chọn tòa nhà --</option>
            {buildings.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </Box>
        </Box>
      );
    }
    if (targetType === 'block') {
      return (
        <Box mb={4}>
          <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
            Chọn block
          </Box>
          <Box
            as="select"
            value={targetIds[0] || ''}
            onChange={(e) => setTargetIds(e.target.value ? [e.target.value] : [])}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #E2E8F0', backgroundColor: 'white', color: '#1A202C' }}
          >
            <option value="">-- Chọn block --</option>
            {blocks.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </Box>
        </Box>
      );
    }
    if (targetType === 'room') {
      return (
        <Box mb={4}>
          <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
            Chọn phòng
          </Box>
          <Box
            as="select"
            value={targetIds[0] || ''}
            onChange={(e) => setTargetIds(e.target.value ? [e.target.value] : [])}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #E2E8F0', backgroundColor: 'white', color: '#1A202C' }}
          >
            <option value="">-- Chọn phòng --</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </Box>
        </Box>
      );
    }
    if (targetType === 'tenant') {
      return (
        <Box mb={4}>
          <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">
            Chọn khách thuê
          </Box>
          <Box
            as="select"
            value={targetIds[0] || ''}
            onChange={(e) => setTargetIds(e.target.value ? [e.target.value] : [])}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #E2E8F0', backgroundColor: 'white', color: '#1A202C' }}
          >
            <option value="">-- Chọn khách --</option>
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.fullName}</option>
            ))}
          </Box>
        </Box>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <>
      <Box position="fixed" top="0" left="0" right="0" bottom="0" bg="blackAlpha.600" zIndex="1000" onClick={onClose} />
      <Box position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" bg="white" borderRadius="lg" boxShadow="xl" maxW={{ base: '90%', md: '640px' }} w="full" maxH="90vh" overflowY="auto" zIndex="1001" color="gray.800">
        <Box px={6} py={4} borderBottom="1px" borderColor="gray.200" display="flex" alignItems="center" justifyContent="space-between" position="sticky" top="0" bg="white" zIndex="10">
          <Box fontSize="lg" fontWeight="semibold" color="gray.800">Tạo thông báo</Box>
          <Button variant="ghost" size="sm" onClick={onClose} color="gray.500" _hover={{ bg: 'gray.100' }}>✕</Button>
        </Box>

        <Box px={6} py={6}>
          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">Tiêu đề</Box>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} onMouseDown={focusOnMouseDown} placeholder="Nhập tiêu đề thông báo" bg="white" borderColor="gray.300" color="gray.800" _placeholder={{ color: 'gray.400' }} />
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">Nội dung</Box>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} onMouseDown={focusOnMouseDown} placeholder="Nhập nội dung thông báo" rows={4} bg="white" borderColor="gray.300" color="gray.800" _placeholder={{ color: 'gray.400' }} />
          </Box>

          <Box mb={4}>
            <Box as="label" display="block" mb={2} fontWeight="medium" fontSize="sm" color="gray.700">Gửi tới</Box>
            <Box
              as="select"
              value={targetType}
              onChange={(e) => { setTargetType(e.target.value as NotificationTargetType); setTargetIds([]); }}
              onMouseDown={focusOnMouseDown}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #E2E8F0', backgroundColor: 'white', color: '#1A202C' }}
            >
              <option value="all">Tất cả</option>
              <option value="building">Theo tòa nhà</option>
              <option value="block">Theo block</option>
              <option value="room">Theo phòng</option>
              <option value="tenant">Theo khách</option>
            </Box>
          </Box>

          {renderTargetSelect()}
        </Box>

        <Box px={6} py={4} borderTop="1px" borderColor="gray.200" display="flex" justifyContent="flex-end" gap={3} position="sticky" bottom="0" bg="white">
          <Button variant="outline" onClick={onClose}>Hủy</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isDisabled={!title.trim() || !content.trim()}>Gửi thông báo</Button>
        </Box>
      </Box>
    </>
  );
}


