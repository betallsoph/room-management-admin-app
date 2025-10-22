import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoomManagementProvider } from './contexts/RoomManagementContext';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { ManagePage } from './pages/ManagePage';
import { BuildingsPage } from './pages/BuildingsPage';
import { BlocksPage } from './pages/BlocksPage';
import { RoomsPage } from './pages/RoomsPage';
import { TenantsPage } from './pages/TenantsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { InvoicesPage } from './pages/InvoicesPage';

function App() {
  return (
    <BrowserRouter>
      <RoomManagementProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/manage" element={<ManagePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/buildings" element={<BuildingsPage />} />
            <Route path="/blocks" element={<BlocksPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/tenants" element={<TenantsPage />} />
          </Routes>
        </Layout>
      </RoomManagementProvider>
    </BrowserRouter>
  );
}

export default App;
