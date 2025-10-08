// Bottom Navbar Component - For Mobile
import { Box, Icon, Text, Flex } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

// Icons từ Chakra UI (dùng SVG path)
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const ManageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
);

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);

const InvoiceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
  </svg>
);

interface NavItem {
  name: string;
  path: string;
  icon: () => React.JSX.Element;
}

const navItems: NavItem[] = [
  { name: 'Trang chủ', path: '/', icon: HomeIcon },
  { name: 'Thông báo', path: '/notifications', icon: SendIcon },
  { name: 'Hóa đơn', path: '/invoices', icon: InvoiceIcon },
  { name: 'Chat', path: '/chat', icon: ChatIcon },
  { name: 'Quản lý', path: '/manage', icon: ManageIcon },
];

export function BottomNavbar() {
  const location = useLocation();

  return (
    <Box
      as="nav"
      pos="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="white"
      borderTop="1px"
      borderColor="gray.200"
      display={{ base: 'block', lg: 'none' }}
      zIndex="30"
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.05)"
      css={{
        '@media (max-width: 380px)': {
          '& > div': {
            height: '3.5rem',
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem'
          }
        }
      }}
    >
      <Flex justify="space-around" align="center" h="16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                textDecoration: 'none',
                color: isActive ? '#3182CE' : '#718096',
                transition: 'all 0.2s',
                minWidth: 0,
              }}
            >
              <Icon 
                as={item.icon} 
                mb={1}
                boxSize={6}
                color={isActive ? 'blue.500' : 'gray.500'}
                css={{
                  '@media (max-width: 380px)': {
                    marginBottom: '0.125rem',
                    width: '1.25rem',
                    height: '1.25rem'
                  }
                }}
              />
              <Text 
                fontSize="xs"
                fontWeight={isActive ? 600 : 400}
                color={isActive ? 'blue.500' : 'gray.600'}
                textAlign="center"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                maxW="100%"
                css={{
                  '@media (max-width: 380px)': {
                    fontSize: '10px',
                    lineHeight: '1.2'
                  }
                }}
              >
                {item.name}
              </Text>
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
}
