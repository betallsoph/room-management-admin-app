// Layout Component - Bố cục chính của app
import { Box, Flex } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileSidebar } from './MobileSidebar';
import { BottomNavbar } from './BottomNavbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <Box 
          as="main" 
          p={{ base: 4, md: 6 }}
          pb={{ base: 20, lg: 6 }} // Extra padding bottom on mobile for bottom navbar
        >
          {children}
        </Box>
      </Box>

      {/* Bottom Navbar for Mobile */}
      <BottomNavbar />
    </Flex>
  );
}
