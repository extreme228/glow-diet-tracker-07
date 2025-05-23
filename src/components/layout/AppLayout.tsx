
import React from 'react';
import { NavBar } from './NavBar';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground">
      <NavBar />
      <main className="container mx-auto p-4 pb-24">
        <Outlet />
      </main>
    </div>
  );
};
