// Confirm Delete Dialog Component
import { Box, Button, Flex, Text } from '@chakra-ui/react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận xóa',
  message = 'Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác.',
  confirmText = 'Xóa',
  cancelText = 'Hủy',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
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

      {/* Dialog */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        maxW={{ base: '90%', md: '400px' }}
        w="full"
        zIndex="1001"
      >
        {/* Icon & Title */}
        <Box px={6} pt={6} pb={4}>
          <Flex alignItems="center" mb={3}>
            <Box
              w="12"
              h="12"
              borderRadius="full"
              bg="red.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr={4}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E53E3E">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </Box>
            <Box flex="1">
              <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                {title}
              </Text>
            </Box>
          </Flex>
          <Text color="gray.600" fontSize="sm">
            {message}
          </Text>
        </Box>

        {/* Actions */}
        <Box
          px={6}
          py={4}
          bg="gray.50"
          borderBottomRadius="lg"
          display="flex"
          justifyContent="flex-end"
          gap={3}
        >
          <Button
            variant="outline"
            onClick={onClose}
            size="sm"
          >
            {cancelText}
          </Button>
          <Button
            colorScheme="red"
            onClick={handleConfirm}
            size="sm"
          >
            {confirmText}
          </Button>
        </Box>
      </Box>
    </>
  );
}
