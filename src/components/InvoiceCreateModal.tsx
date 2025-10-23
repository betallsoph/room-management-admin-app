import { Box, Button, Flex, Input, Text, Textarea } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { appToaster } from '../lib/toaster';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import type { InvoiceStatus, Invoice } from '../types';

interface InvoiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
}

interface LineItemDraft {
  id: string;
  label: string;
  amount: number;
  description?: string;
  quantity?: number;
  unit?: string;
}

const statusOptions: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue'];

export function InvoiceFormModal({ isOpen, onClose, invoice }: InvoiceFormModalProps) {
  const { tenants, rooms, blocks, buildings, addInvoice, updateInvoice } = useRoomManagement();
  const [tenantId, setTenantId] = useState('');
  const [period, setPeriod] = useState(() => new Date().toISOString().slice(0, 7));
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<InvoiceStatus>('draft');
  const [notes, setNotes] = useState('');
  const initialLineItems = () => [
    {
      id: `item-${Date.now()}`,
      label: 'Tiền phòng',
      amount: 0,
    },
  ];

  const [lineItems, setLineItems] = useState<LineItemDraft[]>(initialLineItems);

  const isEdit = Boolean(invoice);

  const applyInvoiceToForm = (inv: Invoice) => {
    setTenantId(inv.tenantId);
    setPeriod(inv.period);
    setDueDate(new Date(inv.dueDate).toISOString().split('T')[0]);
    setStatus(inv.status as InvoiceStatus);
    setNotes(inv.notes ?? '');
    setLineItems(
      inv.lineItems.map((item) => ({
        id: item.id ?? `item-${Math.random().toString(36).slice(2, 8)}`,
        label: item.label,
        amount: item.amount,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
      })),
    );
  };

  const applyDefaultForm = () => {
    setTenantId('');
    const now = new Date();
    setPeriod(now.toISOString().slice(0, 7));
    setDueDate(now.toISOString().split('T')[0]);
    setStatus('draft');
    setNotes('');
    setLineItems(initialLineItems());
  };

  const resetForm = () => {
    if (invoice) {
      applyInvoiceToForm(invoice);
    } else {
      applyDefaultForm();
    }
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [invoice, isOpen]);

  const tenantOptions = useMemo(() => {
    return tenants.map((tenant) => {
      const room = rooms.find((r) => r.id === tenant.roomId);
      const block = room ? blocks.find((b) => b.id === room.blockId) : undefined;
      const building = block ? buildings.find((b) => b.id === block.buildingId) : undefined;
      return {
        id: tenant.id,
        label: `${tenant.fullName} • ${room?.name ?? 'Phòng ?'}${block ? ` • ${block.name}` : ''}${building ? ` • ${building.name}` : ''}`,
        monthlyRent: tenant.monthlyRent,
        room,
        block,
        building,
      };
    });
  }, [tenants, rooms, blocks, buildings]);

  const selectedTenant = tenantOptions.find((t) => t.id === tenantId);

  const totalAmount = useMemo(
    () => lineItems.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0), 0),
    [lineItems],
  );

  const handleAddLineItem = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label: '',
        amount: 0,
      },
    ]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleChangeLineItem = (id: string, field: keyof LineItemDraft, value: string) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'amount' || field === 'quantity'
                  ? Number(value) || 0
                  : value,
            }
          : item,
      ),
    );
  };

  const validateForm = () => {
    if (!tenantId) {
      appToaster.error({ title: 'Thiếu thông tin', description: 'Vui lòng chọn khách thuê.' });
      return false;
    }
    if (!period) {
      appToaster.error({ title: 'Thiếu thông tin', description: 'Vui lòng chọn kỳ hoá đơn.' });
      return false;
    }
    if (!dueDate) {
      appToaster.error({ title: 'Thiếu thông tin', description: 'Vui lòng chọn hạn thanh toán.' });
      return false;
    }
    const hasValidLineItem = lineItems.some((item) => item.label.trim() && item.amount > 0);
    if (!hasValidLineItem) {
      appToaster.error({
        title: 'Thiếu thông tin',
        description: 'Vui lòng nhập ít nhất một dòng chi phí với số tiền hợp lệ.',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const tenantRef = selectedTenant;
    if (!tenantRef || !tenantRef.room || !tenantRef.block || !tenantRef.building) {
      appToaster.error({
        title: 'Thiếu dữ liệu',
        description: 'Không tìm thấy thông tin phòng cho khách thuê đã chọn.',
      });
      return;
    }

    const preparedItems = lineItems
      .filter((item) => item.label.trim() && item.amount > 0)
      .map((item) => ({
        id: item.id,
        label: item.label.trim(),
        amount: item.amount,
        description: item.description?.trim() || undefined,
        quantity: item.quantity && item.quantity > 0 ? item.quantity : undefined,
        unit: item.unit?.trim() || undefined,
      }));

    const now = new Date();

    if (!isEdit) {
      addInvoice({
        buildingId: tenantRef.building.id,
        blockId: tenantRef.block.id,
        roomId: tenantRef.room.id,
        tenantId: tenantRef.id,
        issueDate: now,
        period,
        status,
        lineItems: preparedItems,
        totalAmount,
        balanceDue: status === 'paid' ? 0 : totalAmount,
        dueDate: new Date(dueDate),
        notes: notes.trim() || undefined,
        sentAt: status === 'sent' || status === 'paid' ? now : undefined,
        paidAt: status === 'paid' ? now : undefined,
      });

      appToaster.success({
        title: 'Đã tạo hoá đơn mới',
        description:
          status === 'draft'
            ? 'Hoá đơn đang ở trạng thái nháp.'
            : status === 'sent'
            ? 'Hoá đơn đã đánh dấu là đã gửi.'
            : status === 'paid'
            ? 'Hoá đơn đã được đánh dấu thanh toán.'
            : 'Hoá đơn được tạo với trạng thái quá hạn.',
      });
    } else if (invoice) {
      let sentAt = invoice.sentAt ?? null;
      let paidAt = invoice.paidAt ?? null;

      if (status === 'draft') {
        sentAt = null;
        paidAt = null;
      } else if (status === 'sent') {
        sentAt = sentAt ?? now;
        paidAt = null;
      } else if (status === 'paid') {
        sentAt = sentAt ?? now;
        paidAt = now;
      } else {
        sentAt = sentAt ?? now;
        paidAt = null;
      }

      updateInvoice(invoice.id, {
        buildingId: tenantRef.building.id,
        blockId: tenantRef.block.id,
        roomId: tenantRef.room.id,
        tenantId: tenantRef.id,
        period,
        status,
        lineItems: preparedItems,
        totalAmount,
        balanceDue: status === 'paid' ? 0 : totalAmount,
        dueDate: new Date(dueDate),
        notes: notes.trim() || undefined,
        sentAt: sentAt ?? undefined,
        paidAt: paidAt ?? undefined,
      });

      appToaster.success({ title: 'Đã cập nhật hoá đơn' });
    }

    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Box
        position="fixed"
        inset="0"
        bg="blackAlpha.600"
        zIndex="1000"
        onClick={() => {
          resetForm();
          onClose();
        }}
      />
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        borderRadius="xl"
        boxShadow="xl"
        maxW={{ base: '95%', md: '720px' }}
        w="full"
        maxH="92vh"
        overflowY="auto"
        zIndex="1001"
        color="gray.800"
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          px={6}
          py={4}
          borderBottom="1px solid"
          borderColor="gray.200"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="lg" fontWeight="semibold">
            {isEdit ? 'Chỉnh sửa hoá đơn' : 'Tạo hoá đơn mới'}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetForm();
              onClose();
            }}
            color="gray.500"
            _hover={{ bg: 'gray.100' }}
          >
            ✕
          </Button>
        </Box>

        <Box px={6} py={6} display="flex" flexDirection="column" gap={6}>
          <Box>
            <Text fontWeight="medium" fontSize="sm" mb={2}>
              Khách thuê
            </Text>
            <Box
              as="select"
              value={tenantId}
              onChange={(e) => {
                setTenantId(e.target.value);
                const tenant = tenantOptions.find((t) => t.id === e.target.value);
                if (tenant) {
                  setLineItems((prev) =>
                    prev.map((item, idx) =>
                      idx === 0
                        ? {
                            ...item,
                            amount: tenant.monthlyRent,
                            label: 'Tiền phòng',
                          }
                        : item,
                    ),
                  );
                }
              }}
              placeholder="Chọn khách thuê"
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              py={2}
              px={3}
              bg="white"
              color="gray.800"
            >
              <option value="" disabled>
                Chọn khách thuê
              </option>
              {tenantOptions.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.label}
                </option>
              ))}
            </Box>
          </Box>

          <Flex gap={4} flexDir={{ base: 'column', md: 'row' }}>
            <Box flex="1">
              <Text fontWeight="medium" fontSize="sm" mb={2}>
                Kỳ hoá đơn
              </Text>
              <Input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} />
            </Box>
            <Box flex="1">
              <Text fontWeight="medium" fontSize="sm" mb={2}>
                Hạn thanh toán
              </Text>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </Box>
            <Box flex="1">
              <Text fontWeight="medium" fontSize="sm" mb={2}>
                Trạng thái
              </Text>
              <Box
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                py={2}
                px={3}
                bg="white"
                color="gray.800"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === 'draft'
                      ? 'Nháp'
                      : option === 'sent'
                      ? 'Đã gửi'
                      : option === 'paid'
                      ? 'Đã thanh toán'
                      : 'Quá hạn'}
                  </option>
                ))}
              </Box>
            </Box>
          </Flex>

          <Box>
            <Flex justify="space-between" align="center" mb={3}>
              <Text fontWeight="semibold">Chi tiết chi phí</Text>
              <Button size="sm" variant="outline" onClick={handleAddLineItem}>
                + Thêm dòng
              </Button>
            </Flex>
            <Box display="flex" flexDirection="column" gap={4}>
              {lineItems.map((item, index) => (
                <Box key={item.id} border="1px solid" borderColor="gray.200" borderRadius="md" p={4}>
                  <Flex gap={4} flexDir={{ base: 'column', md: 'row' }}>
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="medium" mb={1}>
                        Mô tả
                      </Text>
                      <Input
                        value={item.label}
                        onChange={(e) => handleChangeLineItem(item.id, 'label', e.target.value)}
                        placeholder="Ví dụ: Tiền phòng"
                      />
                    </Box>
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="medium" mb={1}>
                        Số tiền (VNĐ)
                      </Text>
                      <Input
                        type="number"
                        min="0"
                        value={item.amount}
                        onChange={(e) => handleChangeLineItem(item.id, 'amount', e.target.value)}
                        placeholder="0"
                      />
                    </Box>
                  </Flex>
                  <Flex gap={4} mt={3} flexDir={{ base: 'column', md: 'row' }}>
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="medium" mb={1}>
                        Ghi chú (tuỳ chọn)
                      </Text>
                      <Textarea
                        value={item.description ?? ''}
                        onChange={(e) => handleChangeLineItem(item.id, 'description', e.target.value)}
                        placeholder="Mô tả chi tiết"
                        rows={2}
                      />
                    </Box>
                    <Box display="flex" gap={3}>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>
                          Số lượng
                        </Text>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity ?? ''}
                          onChange={(e) => handleChangeLineItem(item.id, 'quantity', e.target.value)}
                          placeholder="1"
                          w="80px"
                        />
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" mb={1}>
                          Đơn vị
                        </Text>
                        <Input
                          value={item.unit ?? ''}
                          onChange={(e) => handleChangeLineItem(item.id, 'unit', e.target.value)}
                          placeholder="kWh, m³..."
                          w="100px"
                        />
                      </Box>
                    </Box>
                  </Flex>
                  {lineItems.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      colorScheme="red"
                      mt={3}
                      onClick={() => handleRemoveLineItem(item.id)}
                    >
                      Xoá dòng
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Text fontWeight="medium" fontSize="sm" mb={2}>
              Ghi chú thêm (tuỳ chọn)
            </Text>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú gửi cho khách thuê..."
              rows={3}
            />
          </Box>
        </Box>

        <Box
          px={6}
          py={4}
          borderTop="1px solid"
          borderColor="gray.200"
          display="flex"
          flexDir={{ base: 'column', md: 'row' }}
          gap={3}
          alignItems={{ base: 'stretch', md: 'center' }}
          justifyContent="space-between"
        >
          <Text fontWeight="semibold" color="gray.700">
            Tổng cộng: {new Intl.NumberFormat('vi-VN').format(totalAmount)} đ
          </Text>
          <Flex gap={3} justify="flex-end">
            <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>
              Huỷ
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit} isDisabled={!tenantId || totalAmount <= 0}>
              {isEdit ? 'Lưu thay đổi' : 'Tạo hoá đơn'}
            </Button>
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export default InvoiceFormModal;
