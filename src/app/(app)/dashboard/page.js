'use client';
import { useAuth } from '@/hooks/useAuth';
import ProtectedPage from '@/components/layout/ProtectedPage';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedPage roles={['admin', 'siswa']}>
      {user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
    </ProtectedPage>
  );
}
