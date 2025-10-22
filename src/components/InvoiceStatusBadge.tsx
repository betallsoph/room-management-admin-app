import { Badge } from '@chakra-ui/react';
import type { InvoiceStatus } from '../types';

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  draft: 'Nháp',
  sent: 'Đã gửi',
  paid: 'Đã thanh toán',
  overdue: 'Quá hạn',
  cancelled: 'Đã hủy',
};

const colorMap: Record<InvoiceStatus, string> = {
  draft: 'gray',
  sent: 'blue',
  paid: 'green',
  overdue: 'red',
  cancelled: 'orange',
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Badge colorScheme={colorMap[status]} fontSize="xs" px={2} py={1} borderRadius="full">
      {invoiceStatusLabels[status]}
    </Badge>
  );
}

