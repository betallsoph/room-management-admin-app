// Mobile Sidebar Component - Drawer navigation cho mobile
import { Box, VStack, Link as ChakraLink, Icon, Text, Flex, IconButton } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Icons
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface NavItem {
  name: string;
  path: string;
  icon: () => React.JSX.Element;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Căn hộ', path: '/buildings', icon: BuildingIcon },
  { name: 'Blocks', path: '/blocks', icon: BuildingIcon },
  { name: 'Tầng', path: '/floors', icon: BuildingIcon },
  { name: 'Phòng', path: '/rooms', icon: BuildingIcon },
  { name: 'Khách thuê', path: '/tenants', icon: UsersIcon },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const location = useLocation();

  // Đóng sidebar khi chuyển trang
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  if (!isOpen) return null;

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
        zIndex="998"
        onClick={onClose}
        display={{ base: 'block', lg: 'none' }}
      />

      {/* Sidebar */}
      <Box
        position="fixed"
        top="0"
        left="0"
        w="280px"
        h="full"
        bg="white"
        zIndex="999"
        display={{ base: 'block', lg: 'none' }}
        boxShadow="lg"
        overflowY="auto"
      >
        {/* Header */}
        <Flex 
          h="16" 
          alignItems="center" 
          justifyContent="space-between"
          px="6" 
          borderBottom="1px" 
          borderColor="gray.200"
        >
          <Text fontSize="xl" fontWeight="bold" color="blue.600">
            Room Manager
          </Text>
          <IconButton
            onClick={onClose}
            aria-label="Close menu"
            variant="ghost"
            size="sm"
          >
            <CloseIcon />
          </IconButton>
        </Flex>

        {/* Navigation Links */}
        <VStack align="stretch" gap={1} p={4}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ChakraLink
                key={item.path}
                asChild
              >
                <Link
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    backgroundColor: isActive ? '#EBF8FF' : 'transparent',
                    color: isActive ? '#3182CE' : '#4A5568',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.2s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#F7FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon as={item.icon} mr={3} />
                  {item.name}
                </Link>
              </ChakraLink>
            );
          })}
        </VStack>
      </Box>
    </>
  );
}
