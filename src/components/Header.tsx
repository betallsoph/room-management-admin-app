// Header Component
import { Flex, Text, IconButton } from '@chakra-ui/react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <Flex
      as="header"
      h="16"
      alignItems="center"
      justifyContent="space-between"
      px={{ base: 4, md: 6 }}
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      position="sticky"
      top="0"
      zIndex="10"
    >
      <Flex alignItems="center" gap={3}>
        {/* Mobile Menu Button - Hidden since we use BottomNavbar on mobile */}
        {/* <IconButton
          display={{ base: 'flex', lg: 'none' }}
          onClick={onMenuClick}
          aria-label="Open menu"
          variant="ghost"
          size="sm"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </IconButton> */}
        
        {/* Logo moved to Sidebar */}
      </Flex>

      {/* User info */}
      <Flex alignItems="center" gap={2}>
        <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600" display={{ base: 'none', sm: 'block' }}>Admin</Text>
      </Flex>
    </Flex>
  );
}
