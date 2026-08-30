import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export const MainLayout = () => {
  return (
    <div className="app-shell flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
