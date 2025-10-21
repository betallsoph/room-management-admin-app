// Manage Page - Trang quản lý tổng hợp với tabs
import { Box, Heading, Tabs } from '@chakra-ui/react';
import { useState } from 'react';
import { BuildingsPage } from './BuildingsPage';
import { BlocksPage } from './BlocksPage';
import { RoomsPage } from './RoomsPage';
import { FloorsPage } from './FloorsPage';
import { TenantsPage } from './TenantsPage';

export function ManagePage() {
  const [activeTab, setActiveTab] = useState('buildings');

  const tabs = [
    { id: 'buildings', label: 'Căn hộ', component: <BuildingsPage /> },
    { id: 'blocks', label: 'Blocks', component: <BlocksPage /> },
    { id: 'floors', label: 'Tầng', component: <FloorsPage /> },
    { id: 'rooms', label: 'Phòng', component: <RoomsPage /> },
    { id: 'tenants', label: 'Khách thuê', component: <TenantsPage /> },
  ];

  return (
    <Box>
      <Heading mb={6} fontSize={{ base: '2xl', md: '3xl' }}>Quản lý</Heading>

      <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
        <Tabs.List mb={6}>
          {tabs.map((tab) => (
            <Tabs.Trigger key={tab.id} value={tab.id}>
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      {/* Render ONLY active tab content to avoid mounting heavy pages simultaneously */}
      <Box>
        {tabs.find(t => t.id === activeTab)?.component}
      </Box>
    </Box>
  );
}
