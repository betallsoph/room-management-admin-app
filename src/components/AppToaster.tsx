import { Box, Flex } from '@chakra-ui/react';
import {
  Toaster,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastIndicator,
  ToastCloseTrigger,
} from '@chakra-ui/react';
import { appToaster } from '../lib/toaster';

export function AppToaster() {
  return (
    <Toaster toaster={appToaster} gap="12px">
      {(toast) => (
        <ToastRoot
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={3}
          px={4}
          py={3}
          borderRadius="md"
          boxShadow="lg"
          bg="white"
          minW="280px"
          maxW="360px"
        >
          <Flex align="flex-start" gap={3} flex="1">
            <ToastIndicator />
            <Box flex="1">
              {toast.title && (
                <ToastTitle fontWeight="semibold" color="gray.900">
                  {toast.title}
                </ToastTitle>
              )}
              {toast.description && (
                <ToastDescription mt={1} fontSize="sm" color="gray.600">
                  {toast.description}
                </ToastDescription>
              )}
            </Box>
          </Flex>
          <ToastCloseTrigger />
        </ToastRoot>
      )}
    </Toaster>
  );
}
