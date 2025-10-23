// Layout Component - Bố cục chính của app
import { Box, Flex } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { BottomNavbar } from './BottomNavbar';

export function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = window.localStorage.getItem('room-admin-auth');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <Flex minH="100vh" bg="gray.50">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Sidebar - Disabled, using BottomNavbar instead */}
      {/* <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      /> */}
      
      {/* Main Content */}
      <Box flex="1" ml={{ base: 0, lg: 60 }} w={{ base: '100%', lg: 'auto' }}>
        <Box 
          as="main" 
          p={{ base: 4, md: 6 }}
          pb={{ base: 20, lg: 6 }} // Extra padding bottom on mobile for bottom navbar
        >
          <Outlet />
        </Box>
      </Box>

      {/* Bottom Navbar for Mobile */}
      <BottomNavbar />
    </Flex>
  );
}
