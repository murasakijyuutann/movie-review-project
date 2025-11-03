// MainLayout.jsx
import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar';

export default function MainLayout() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-black">
      <NavBar />
      <div className="pt-24 p-8">
        <Outlet /> {/* Pages will render here */}
      </div>
    </div>
  );
}
