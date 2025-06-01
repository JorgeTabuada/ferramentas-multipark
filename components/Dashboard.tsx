"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { subApps, SubApp } from '@/utils/subApps';
import { toast } from 'sonner';

interface DashboardProps {
  selectedPark: string;
  setSelectedPark: (park: string) => void;
}

export const Dashboard = ({ selectedPark, setSelectedPark }: DashboardProps) => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleParkChange = (value: string) => {
    setSelectedPark(value);
    localStorage.setItem('multiparkSelectedPark', value);
    toast.success(`Parque alterado para: ${value.toUpperCase()}`);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const navigateToSubApp = (appId: string) => {
    router.push(`/${appId}`);
  };

  const getUserDisplayName = () => {
    if (!user?.email) return 'UTILIZADOR';
    return user.email.split('@')[0].toUpperCase();
  };

  const groupedApps = subApps.reduce((acc, app) => {
    if (!acc[app.category]) acc[app.category] = [];
    acc[app.category].push(app);
    return acc;
  }, {} as Record<string, SubApp[]>);

  const categories = ['Operacional', 'Gestão', 'Análises', 'Administração e Suporte'];

  const parks = [
    { id: 'lisboa', name: 'LISBOA' },
    { id: 'porto', name: 'PORTO' },
    { id: 'faro', name: 'FARO' }
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-900 text-white px-3 py-1 rounded mr-2 font-black text-3xl">
              P
            </div>
            <span className="text-blue-900 font-bold text-3xl">MULTIPARK</span>
          </div>
          
          <h1 className="text-xl font-semibold text-gray-800 mb-4">
            BEM-VINDO DE VOLTA, {getUserDisplayName()}!
          </h1>

          <div className="flex justify-center gap-4 mb-6">
            {parks.map((park) => (
              <Button
                key={park.id}
                variant={selectedPark === park.id ? "default" : "outline"}
                onClick={() => handleParkChange(park.id)}
                className={`px-6 py-2 ${
                  selectedPark === park.id 
                    ? 'bg-blue-600 text-white' 
                    : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                {park.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.map((category) => (
            <Card key={category} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-900 border-b-2 border-blue-600 pb-2">
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupedApps[category]?.sort((a, b) => a.name.localeCompare(b.name)).map((app) => (
                    <Button
                      key={app.id}
                      variant="outline"
                      className="h-20 text-xs font-semibold border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                      onClick={() => navigateToSubApp(app.id)}
                    >
                      {app.name}
                    </Button>
                  )) || (
                    <p className="col-span-full text-xs text-gray-500 p-4">
                      Sem aplicações nesta categoria.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <div className="max-w-xs mx-auto">
          <Button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};