
import React from 'react';
import { NavBar } from './NavBar';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-nutritrack-background to-nutritrack-background/90 text-white">
      <NavBar />
      <main className="container mx-auto p-4 pb-24">
        <Outlet />
      </main>
    </div>
  );
};
