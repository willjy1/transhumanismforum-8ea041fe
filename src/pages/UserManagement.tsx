import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import UserManagement from '@/components/UserManagement';

const UserManagementPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>User Management | Beyond Humanity</title>
        <meta name="description" content="Manage user roles and permissions" />
      </Helmet>

      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="mb-8">
              <h1 className="text-3xl font-light tracking-tight mb-2">
                User Management
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage user roles and permissions across the platform
              </p>
            </div>

            <UserManagement />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagementPage;