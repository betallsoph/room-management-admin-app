// Dashboard Page - Trang tổng quan
import { 
  Box, 
  SimpleGrid, 
  Stat,
  Text,
  Heading,
  Card,
  Button,
  Flex
} from '@chakra-ui/react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import { RoomStatus, TenantStatus } from '../types';
import { Link } from 'react-router-dom';

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

export function DashboardPage() {
  const { buildings, blocks, rooms, tenants } = useRoomManagement();

  // Tính toán thống kê
  const stats = {
    totalBuildings: buildings.length,
    totalBlocks: blocks.length,
    totalRooms: rooms.length,
    availableRooms: rooms.filter(r => r.status === RoomStatus.AVAILABLE).length,
    occupiedRooms: rooms.filter(r => r.status === RoomStatus.OCCUPIED).length,
    activeTenants: tenants.filter(t => t.status === TenantStatus.ACTIVE).length,
    totalRevenue: tenants
      .filter(t => t.status === TenantStatus.ACTIVE)
      .reduce((sum, t) => sum + t.monthlyRent, 0),
  };

  return (
    <Box>
      <Flex 
        justify="space-between" 
        align="center" 
        mb={{ base: 4, md: 6 }}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 3, sm: 0 }}
      >
        <Heading fontSize={{ base: '2xl', md: '3xl' }} color="gray.800">Tổng quan</Heading>
        
        {/* Nút Cài đặt - chỉ hiện trên mobile */}
        <Box display={{ base: 'block', lg: 'none' }} w={{ base: 'full', sm: 'auto' }}>
          <Button
            asChild
            colorScheme="gray"
            variant="outline"
            size={{ base: 'sm', md: 'md' }}
            w={{ base: 'full', sm: 'auto' }}
          >
            <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SettingsIcon />
              Cài đặt
            </Link>
          </Button>
        </Box>
      </Flex>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 4, md: 6 }} mb={{ base: 6, md: 8 }}>
        <StatCard
          label="Tổng căn hộ"
          value={stats.totalBuildings}
          color="blue.500"
        />
        <StatCard
          label="Tổng phòng"
          value={stats.totalRooms}
          color="green.500"
        />
        <StatCard
          label="Phòng trống"
          value={stats.availableRooms}
          color="orange.500"
        />
        <StatCard
          label="Khách thuê"
          value={stats.activeTenants}
          color="purple.500"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 6 }}>
        <StatCard
          label="Phòng đang cho thuê"
          value={stats.occupiedRooms}
          color="teal.500"
        />
        <StatCard
          label="Doanh thu hàng tháng"
          value={new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
          }).format(stats.totalRevenue)}
          color="green.600"
        />
      </SimpleGrid>
    </Box>
  );
}

// Stat Card Component
interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <Card.Root>
      <Card.Body p={{ base: 4, md: 6 }}>
        <Stat.Root>
          <Stat.Label color="gray.600" fontSize={{ base: 'xs', md: 'sm' }}>{label}</Stat.Label>
          <Stat.ValueText color={color} fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
            {value}
          </Stat.ValueText>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}
