"use client";

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const [selectedPark, setSelectedPark] = useState('lisboa');

  useEffect(() => {
    const savedPark = localStorage.getItem('multiparkSelectedPark');
    if (savedPark) {
      setSelectedPark(savedPark);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <LoginForm />
      ) : (
        <Dashboard selectedPark={selectedPark} setSelectedPark={setSelectedPark} />
      )}
    </div>
  );
}
