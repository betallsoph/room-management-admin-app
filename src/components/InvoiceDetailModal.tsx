import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import type { Invoice } from '../types';
import { InvoiceStatusBadge, invoiceStatusLabels } from './InvoiceStatusBadge';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

const currencyFormatter = new Intl.NumberFormat('vi-VN');

export function InvoiceDetailModal({ invoice, isOpen, onClose }: InvoiceDetailModalProps) {
  const { tenants, rooms, blocks, buildings } = useRoomManagement();

  const contextData = useMemo(() => {
    if (!invoice) {
      return {
        tenantName: '',
        roomLabel: '',
        blockName: '',
        buildingName: '',
      };
    }

    const tenant = tenants.find(t => t.id === invoice.tenantId);
    const room = rooms.find(r => r.id === invoice.roomId);
    const block = room ? blocks.find(b => b.id === room.blockId) : undefined;
    const building = block ? buildings.find(b => b.id === block.buildingId) : undefined;

    return {
      tenantName: tenant?.fullName || '—',
      roomLabel: room?.name || room?.roomNumber || '—',
      blockName: block?.name || '',
      buildingName: building?.name || '',
    };
  }, [invoice, tenants, rooms, blocks, buildings]);

  if (!isOpen || !invoice) {
    return null;
  }

  const attachments = invoice.attachments ?? [];

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
        maxW={{ base: '92%', md: '720px' }}
        w="full"
        maxH="92vh"
        overflowY="auto"
        zIndex="1001"
        color="gray.800"
        onClick={(event) => event.stopPropagation()}
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
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              Chi tiết hóa đơn
            </Text>
            <Text fontSize="sm" color="gray.500">
              {invoice.id} · {invoiceStatusLabels[invoice.status]}
            </Text>
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

        <Box px={6} py={6} display="flex" flexDirection="column" gap={6}>
          <Box>
            <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={4}>
              <Box>
                <Text fontSize="xl" fontWeight="semibold" color="gray.800">
                  {contextData.tenantName}
                </Text>
                <Text color="gray.600">
                  Phòng {contextData.roomLabel}
                  {contextData.blockName ? ` · ${contextData.blockName}` : ''}
                  {contextData.buildingName ? ` · ${contextData.buildingName}` : ''}
                </Text>
              </Box>
              <InvoiceStatusBadge status={invoice.status} />
            </Flex>
            <Box mt={4} color="gray.600" fontSize="sm" display="grid" rowGap="0.35rem">
              <Text>Kỳ: {formatPeriod(invoice.period)}</Text>
              <Text>Ngày phát hành: {formatDate(invoice.issueDate)}</Text>
              <Text>Hạn thanh toán: {formatDate(invoice.dueDate)}</Text>
              <Text>Tổng: {currencyFormatter.format(invoice.totalAmount)} đ</Text>
              <Text>
                Còn nợ:{' '}
                <Text
                  as="span"
                  color={invoice.balanceDue === 0 ? 'gray.500' : 'red.500'}
                  fontWeight={invoice.balanceDue === 0 ? 'medium' : 'semibold'}
                >
                  {currencyFormatter.format(invoice.balanceDue)} đ
                </Text>
              </Text>
              {invoice.sentAt && (
                <Text>Đã gửi: {formatDateTime(invoice.sentAt)}</Text>
              )}
              {invoice.paidAt && (
                <Text>Thanh toán: {formatDateTime(invoice.paidAt)}</Text>
              )}
            </Box>
          </Box>

          <Box>
            <Text fontSize="md" fontWeight="semibold" color="gray.800" mb={3}>
              Chi tiết hóa đơn
            </Text>
            <Box border="1px solid" borderColor="gray.100" borderRadius="md" overflow="hidden">
              {invoice.lineItems.map(item => (
                <Box key={item.id} px={4} py={3} borderBottom="1px solid" borderColor="gray.100">
                  <Flex justify="space-between" align="flex-start" gap={4}>
                    <Box>
                      <Text fontWeight="medium" color="gray.800">
                        {item.label}
                      </Text>
                      {item.description && (
                        <Text fontSize="sm" color="gray.500">
                          {item.description}
                        </Text>
                      )}
                      {item.quantity && (
                        <Text fontSize="sm" color="gray.500">
                          Số lượng: {item.quantity}
                          {item.unit ? ` ${item.unit}` : ''}
                        </Text>
                      )}
                    </Box>
                    <Text fontWeight="semibold" color="gray.800">
                      {currencyFormatter.format(item.amount)} đ
                    </Text>
                  </Flex>
                </Box>
              ))}
              <Box px={4} py={3} bg="gray.50">
                <Flex justify="space-between" align="center">
                  <Text fontWeight="semibold" color="gray.800">
                    Tổng cộng
                  </Text>
                  <Text fontWeight="bold" color="gray.900">
                    {currencyFormatter.format(invoice.totalAmount)} đ
                  </Text>
                </Flex>
              </Box>
            </Box>
            {invoice.notes && (
              <Box mt={3} p={3} bg="blue.50" border="1px solid" borderColor="blue.100" borderRadius="md">
                <Text fontSize="sm" color="blue.700">
                  Ghi chú: {invoice.notes}
                </Text>
              </Box>
            )}
          </Box>

          <Box>
            <Text fontSize="md" fontWeight="semibold" color="gray.800" mb={3}>
              Chứng từ thanh toán
            </Text>
            {attachments.length === 0 ? (
              <Box
                border="1px dashed"
                borderColor="gray.300"
                borderRadius="md"
                py={6}
                px={4}
                textAlign="center"
                color="gray.500"
                fontSize="sm"
              >
                Chưa có chứng từ nào được đính kèm.
              </Box>
            ) : (
              <Flex flexWrap="wrap" gap={3}>
                {attachments.map((att) => (
                  <Box key={att.id} textAlign="center">
                    <Box
                      h="110px"
                      w="120px"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="blue.200"
                      bg="blue.50"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={2}
                    >
                      <Text fontSize="xs" fontWeight="semibold" color="blue.700">
                        {att.name || 'Chứng từ'}
                      </Text>
                      <Text fontSize="xs" color="blue.600">
                        {att.uploadedAt ? `Tải lên ${formatDateTime(att.uploadedAt)}` : 'Đã đính kèm'}
                      </Text>
                    </Box>
                  </Box>
                ))}
              </Flex>
            )}
          </Box>

          <Box borderTop="1px solid" borderColor="gray.200" />

          <Flex justify="flex-end" gap={3} flexWrap="wrap">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

function formatDate(date?: Date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('vi-VN');
}

function formatDateTime(date?: Date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('vi-VN');
}

function formatPeriod(period: string) {
  const [year, month] = period.split('-');
  return `Tháng ${month}/${year}`;
}
