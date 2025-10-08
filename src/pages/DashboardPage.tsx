// Dashboard Page - Trang tổng quan
import { 
  Box, 
  SimpleGrid, 
  Stat,
  Text,
  Heading,
  Card
} from '@chakra-ui/react';
import { useRoomManagement } from '../contexts/RoomManagementContext';
import { RoomStatus, TenantStatus } from '../types';

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
      <Heading mb={{ base: 4, md: 6 }} fontSize={{ base: '2xl', md: '3xl' }}>Dashboard</Heading>

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
