import '@/styles/globals.css';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/context/AuthContext';
import { APP_NAME, APP_TAGLINE } from '@/utils/constants';

export const metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    'SMK 8 Jakarta Barat — sistem absensi digital untuk membantu guru memonitor kehadiran siswa secara lebih mudah, cepat, dan transparan.',
  keywords: ['SMK 8 Jakarta Barat', 'absensi', 'siswa', 'sekolah', 'kehadiran', 'smk'],
  authors: [{ name: 'SMK 8 Jakarta Barat' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white text-gray-900">
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
