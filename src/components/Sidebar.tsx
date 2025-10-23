// Sidebar Navigation Component
import { Box, VStack, Link as ChakraLink, Icon, Text, Flex, Button } from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { appToaster } from '../lib/toaster';

// Icons từ Chakra UI (dùng SVG path)
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const ManageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

const InvoiceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 17l1.41-1.41L12.83 13H21v-2h-8.17l2.58-2.59L14 7l-5 5 5 5zm-8 3h6v-2H8V6h4V4H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

interface NavItem {
  name: string;
  path: string;
  icon: () => React.JSX.Element;
}

const navItems: NavItem[] = [
  { name: 'Tổng quan', path: '/', icon: HomeIcon },
  { name: 'Thông báo', path: '/notifications', icon: SendIcon },
  { name: 'Hóa đơn', path: '/invoices', icon: InvoiceIcon },
  { name: 'Chat', path: '/chat', icon: ChatIcon },
  { name: 'Quản lý', path: '/manage', icon: ManageIcon },
  { name: 'Cài đặt', path: '/settings', icon: SettingsIcon },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem('room-admin-auth');
    window.sessionStorage.removeItem('room-admin-auth');
    appToaster.info({ title: 'Đã đăng xuất', description: 'Vui lòng đăng nhập lại để tiếp tục.' });
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <Box
      as="nav"
      pos="fixed"
      left="0"
      w="60"
      h="full"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      display={{ base: 'none', lg: 'flex' }}
      flexDirection="column"
      zIndex="20"
    >
      {/* Logo */}
      <Box px={4} py={6} borderBottom="1px" borderColor="gray.200">
        <Text fontSize="xl" fontWeight="bold" color="blue.600">
          Room Manager
        </Text>
      </Box>
      
      {/* Navigation Links */}
      <Flex direction="column" flex="1" justify="space-between">
        <VStack align="stretch" gap={1} p={4} pt={6} flex="1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <ChakraLink key={item.path} asChild>
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

        <Box p={4} pt={0}>
          <Button
            onClick={handleLogout}
            w="full"
            variant="outline"
            colorScheme="red"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <Icon as={LogoutIcon} boxSize={4} />
            Đăng xuất
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
