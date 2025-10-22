import { createToaster } from '@chakra-ui/react';

export const appToaster = createToaster({
  placement: 'top-end',
  gap: 16,
  overlap: false,
});
