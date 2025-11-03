import { AuthProvider } from '../features/auth/AuthProvider';
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
