import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HelpModal from './components/HelpModal';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ServiceDetail from './pages/ServiceDetail';
import RequestForm from './pages/RequestForm';
import RequestSuccess from './pages/RequestSuccess';
import TrackStatus from './pages/TrackStatus';
import Login from './pages/Login';
import AccessDenied from './pages/AccessDenied';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageServices from './pages/admin/ManageServices';
import AuditLog from './pages/admin/AuditLog';

export default function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <BrowserRouter>
      <div
        className="min-h-screen font-sans"
        style={{ backgroundColor: '#F9FAF8', color: '#181C1A' }}
      >
        <Navbar onOpenHelp={() => setIsHelpOpen(true)} />

        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/layanan/:slug" element={<ServiceDetail />} />
            <Route path="/ajukan/:slug" element={<RequestForm />} />
            <Route path="/ajukan/:slug/sukses" element={<RequestSuccess />} />
            <Route path="/lacak" element={<TrackStatus />} />
            <Route path="/masuk" element={<Login />} />
            <Route path="/akses-ditolak" element={<AccessDenied />} />

            {/* Admin routes – protected */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/kelola" element={<ManageServices />} />
              <Route path="/admin/log" element={<AuditLog />} />
            </Route>
          </Routes>
        </main>

        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    </BrowserRouter>
  );
}
