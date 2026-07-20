import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';

const Layout = () => {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        user={user}
      />

      <div className="flex flex-1">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;