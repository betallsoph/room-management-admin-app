import {
  Box,
  Heading,
  Flex,
  Input,
  Button,
  Tabs,
  Text,
  Table,
  Stack,
  Card,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import type { Invoice, InvoiceStatus } from '../types';
import { InvoiceDetailModal } from '../components/InvoiceDetailModal';
import { InvoiceStatusBadge, invoiceStatusLabels } from '../components/InvoiceStatusBadge';
import { appToaster } from '../lib/toaster';

const currencyFormatter = new Intl.NumberFormat('vi-VN');

const statusTabConfig: Array<{ id: 'all' | InvoiceStatus; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'draft', label: invoiceStatusLabels.draft },
  { id: 'sent', label: invoiceStatusLabels.sent },
  { id: 'paid', label: invoiceStatusLabels.paid },
  { id: 'overdue', label: invoiceStatusLabels.overdue },
];

function formatDate(date?: Date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('vi-VN');
}

function getPeriodLabel(period: string) {
  const [year, month] = period.split('-');
  return `Tháng ${month}/${year}`;
}

export function InvoicesPage() {
  const {
    invoices,
    tenants,
    rooms,
    blocks,
    buildings,
    toggleInvoiceSent,
    markInvoicePaid,
    addInvoiceAttachment,
  } = useRoomManagement();
  const [statusFilter, setStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const selectedInvoice = useMemo<Invoice | null>(
    () => (selectedInvoiceId ? invoices.find(inv => inv.id === selectedInvoiceId) || null : null),
    [invoices, selectedInvoiceId],
  );

  const tenantMap = useMemo(() => new Map(tenants.map(t => [t.id, t])), [tenants]);
  const roomMap = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms]);
  const blockMap = useMemo(() => new Map(blocks.map(b => [b.id, b])), [blocks]);
  const buildingMap = useMemo(() => new Map(buildings.map(b => [b.id, b])), [buildings]);

  const filteredInvoices = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return invoices
      .filter(inv => (statusFilter === 'all' ? true : inv.status === statusFilter))
      .filter(inv => {
        if (!keyword) return true;
        const tenant = tenantMap.get(inv.tenantId);
        const room = roomMap.get(inv.roomId);
        const block = room ? blockMap.get(room.blockId) : undefined;
        const building = block ? buildingMap.get(block.buildingId) : undefined;

        const fields = [
          inv.id,
          inv.period,
          tenant?.fullName,
          tenant?.phone,
          room?.name,
          room?.roomNumber,
          block?.name,
          building?.name,
        ]
          .filter(Boolean)
          .map(value => String(value).toLowerCase());

        return fields.some(value => value.includes(keyword));
      })
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }, [invoices, statusFilter, searchQuery, tenantMap, roomMap, blockMap, buildingMap]);

  const stats = useMemo(() => {
    const totals = {
      totalAmount: 0,
      awaitingPayment: 0,
      overdue: 0,
      paid: 0,
    };

    for (const invoice of invoices) {
      totals.totalAmount += invoice.totalAmount;
      if (invoice.status === 'paid') {
        totals.paid += invoice.totalAmount;
      } else if (invoice.status === 'overdue') {
        totals.overdue += invoice.balanceDue;
      } else if (invoice.status === 'sent' || invoice.status === 'draft') {
        totals.awaitingPayment += invoice.balanceDue;
      }
    }
    return totals;
  }, [invoices]);

  const handleToggleSent = (invoiceId: string) => {
    const target = invoices.find(inv => inv.id === invoiceId);
    if (!target) return;
    const wasSent = target.status === 'sent';
    toggleInvoiceSent(invoiceId);
    appToaster.info({
      title: wasSent ? 'Đã bỏ đánh dấu gửi' : 'Đã đánh dấu đã gửi',
      description: target.period ? `Kỳ ${getPeriodLabel(target.period)}` : undefined,
    });
  };

  const handleMarkPaid = (invoiceId: string) => {
    markInvoicePaid(invoiceId);
    appToaster.success({
      title: 'Đã đánh dấu thanh toán',
      description: 'Trạng thái cập nhật sang Đã thanh toán',
    });
  };

  const handleUploadProof = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    addInvoiceAttachment(invoiceId, {
      name: `hoa-don-${invoice.period}.png`,
      url: '',
    });
    appToaster.info({
      title: 'Đã thêm chứng từ',
      description: 'Ảnh minh chứng tạm, chờ kết nối S3 sau',
    });
  };

  const renderDesktopTable = () => (
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
            <Table.ColumnHeader color="gray.700" fontWeight="semibold">
              Khách thuê
            </Table.ColumnHeader>
            <Table.ColumnHeader color="gray.700" fontWeight="semibold">
              Phòng
            </Table.ColumnHeader>
            <Table.ColumnHeader color="gray.700" fontWeight="semibold">
              Kỳ
            </Table.ColumnHeader>
            <Table.ColumnHeader color="gray.700" fontWeight="semibold">
              Phát hành
            </Table.ColumnHeader>
            <Table.ColumnHeader color="gray.700" fontWeight="semibold">
              Hạn thanh toán
            </Table.ColumnHeader>
            <Table.ColumnHeader color="gray.700" fontWeight="semibold">
              Tổng
            </Table.ColumnHeader>
            <Table.ColumnHeader color="gray.700" fontWeight="semibold">
              Còn nợ
            </Table.ColumnHeader>
            <Table.ColumnHeader color="gray.700" fontWeight="semibold">
              Trạng thái
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign="right" color="gray.700" fontWeight="semibold">
              Thao tác
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredInvoices.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={9}>
                <Text textAlign="center" color="gray.500" py={8}>
                  Không có hóa đơn phù hợp.
                </Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            filteredInvoices.map(invoice => {
              const tenant = tenantMap.get(invoice.tenantId);
              const room = roomMap.get(invoice.roomId);
              return (
                <Table.Row key={invoice.id} _hover={{ bg: 'gray.50' }}>
                  <Table.Cell>
                    <Text fontWeight="medium" color="gray.800">
                      {tenant?.fullName || '—'}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {tenant?.phone}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="gray.700">{room?.name || room?.roomNumber || '—'}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="gray.700">{getPeriodLabel(invoice.period)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="gray.700">{formatDate(invoice.issueDate)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="gray.700">{formatDate(invoice.dueDate)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="gray.800">{currencyFormatter.format(invoice.totalAmount)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color={invoice.balanceDue === 0 ? 'gray.600' : 'red.500'}>
                      {currencyFormatter.format(invoice.balanceDue)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </Table.Cell>
                  <Table.Cell>
                    <Flex justify="flex-end" gap={2} wrap="wrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedInvoiceId(invoice.id)}
                      >
                        Xem
                      </Button>
                      {(invoice.status === 'draft' || invoice.status === 'sent') && (
                        <Button
                          size="sm"
                          variant={invoice.status === 'sent' ? 'solid' : 'outline'}
                          colorScheme="blue"
                          onClick={() => handleToggleSent(invoice.id)}
                        >
                          {invoice.status === 'sent' ? 'Đã gửi' : 'Đánh dấu đã gửi'}
                        </Button>
                      )}
                      {invoice.status !== 'paid' && (
                        <Button
                          size="sm"
                          colorScheme="green"
                          variant="outline"
                          onClick={() => handleMarkPaid(invoice.id)}
                        >
                          Đánh dấu thanh toán
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUploadProof(invoice.id)}
                      >
                        Upload ảnh
                      </Button>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );

  const renderMobileList = () => (
    <Box display={{ base: 'block', md: 'none' }}>
      {filteredInvoices.length === 0 ? (
        <Box bg="white" p={6} borderRadius="md" textAlign="center" color="gray.500">
          Không có hóa đơn phù hợp.
        </Box>
      ) : (
        <Stack gap={3}>
          {filteredInvoices.map(invoice => {
            const tenant = tenantMap.get(invoice.tenantId);
            const room = roomMap.get(invoice.roomId);
            return (
              <Card.Root key={invoice.id}>
                <Card.Body p={4}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Box>
                      <Text fontWeight="semibold" color="gray.800">
                        {tenant?.fullName || '—'}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {room?.name || room?.roomNumber || '—'}
                      </Text>
                    </Box>
                    <InvoiceStatusBadge status={invoice.status} />
                  </Flex>

                  <Stack fontSize="sm" color="gray.600" mb={3}>
                    <Text>Kỳ: {getPeriodLabel(invoice.period)}</Text>
                    <Text>Phát hành: {formatDate(invoice.issueDate)}</Text>
                    <Text>Hạn: {formatDate(invoice.dueDate)}</Text>
                    <Text>Tổng: {currencyFormatter.format(invoice.totalAmount)} đ</Text>
                    <Text
                      color={invoice.balanceDue === 0 ? 'gray.500' : 'red.500'}
                      fontWeight={invoice.balanceDue === 0 ? 'normal' : 'semibold'}
                    >
                      Còn nợ: {currencyFormatter.format(invoice.balanceDue)} đ
                    </Text>
                  </Stack>

                  <Flex gap={2} wrap="wrap">
                    <Button size="sm" variant="ghost" onClick={() => setSelectedInvoiceId(invoice.id)}>
                      Xem chi tiết
                    </Button>
                    {(invoice.status === 'draft' || invoice.status === 'sent') && (
                      <Button
                        size="sm"
                        variant={invoice.status === 'sent' ? 'solid' : 'outline'}
                        colorScheme="blue"
                        onClick={() => handleToggleSent(invoice.id)}
                      >
                        {invoice.status === 'sent' ? 'Đã gửi' : 'Đánh dấu đã gửi'}
                      </Button>
                    )}
                    {invoice.status !== 'paid' && (
                      <Button size="sm" colorScheme="green" variant="outline" onClick={() => handleMarkPaid(invoice.id)}>
                        Đánh dấu thanh toán
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleUploadProof(invoice.id)}>
                      Upload ảnh
                    </Button>
                  </Flex>
                </Card.Body>
              </Card.Root>
            );
          })}
        </Stack>
      )}
    </Box>
  );

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        mb={{ base: 4, md: 6 }}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 3, sm: 0 }}
      >
        <Heading fontSize={{ base: '2xl', md: '3xl' }} color="gray.800">
          Hóa đơn
        </Heading>
        <Flex gap={2} w={{ base: 'full', sm: 'auto' }}>
          <Button variant="outline" colorScheme="blue" w={{ base: 'full', sm: 'auto' }}>
            Tạo hóa đơn (coming soon)
          </Button>
        </Flex>
      </Flex>

      <Stack
        direction={{ base: 'column', md: 'row' }}
        gap={3}
        mb={{ base: 4, md: 6 }}
        align="stretch"
      >
        <StatCard label="Tổng giá trị" value={`${currencyFormatter.format(stats.totalAmount)} đ`} />
        <StatCard
          label="Chờ thanh toán"
          value={`${currencyFormatter.format(stats.awaitingPayment)} đ`}
          accent="blue.500"
        />
        <StatCard
          label="Quá hạn"
          value={`${currencyFormatter.format(stats.overdue)} đ`}
          accent="red.500"
        />
        <StatCard
          label="Đã thanh toán"
          value={`${currencyFormatter.format(stats.paid)} đ`}
          accent="green.500"
        />
      </Stack>

      <Box
        mb={{ base: 4, md: 6 }}
        display={{ base: 'block', md: 'flex' }}
        justifyContent="space-between"
        gap={3}
        flexWrap="wrap"
      >
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo khách, phòng, block, tòa..."
          maxW={{ base: 'full', md: '360px' }}
        />

        <Tabs.Root
          value={statusFilter}
          onValueChange={(event) => setStatusFilter(event.value as typeof statusFilter)}
        >
          <Tabs.List>
            {statusTabConfig.map(tab => (
              <Tabs.Trigger key={tab.id} value={tab.id}>
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </Box>

      {renderDesktopTable()}
      {renderMobileList()}

      <InvoiceDetailModal
        invoice={selectedInvoice}
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoiceId(null)}
        onUploadProof={() => selectedInvoice && handleUploadProof(selectedInvoice.id)}
        onToggleSent={() => selectedInvoice && handleToggleSent(selectedInvoice.id)}
        onMarkPaid={() => selectedInvoice && handleMarkPaid(selectedInvoice.id)}
      />
    </Box>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <Box
      flex="1"
      minW="0"
      bg="white"
      borderRadius="md"
      p={4}
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
    >
      <Text fontSize="sm" color="gray.500">
        {label}
      </Text>
      <Text mt={1} fontSize="xl" fontWeight="semibold" color={accent || 'gray.800'}>
        {value}
      </Text>
    </Box>
  );
}
