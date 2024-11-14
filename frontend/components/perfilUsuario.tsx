'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarComponent } from './Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Mail, User } from 'lucide-react';
import { cn } from '../utils/cn';
import jwt from 'jsonwebtoken';

type User = { email: string; name: string; id: string } | null;

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<User>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debe iniciar sesión para acceder a esta página.');
        // Redirigir al login si no hay token
        router.push('/');
        return;
      }
      const decodeToken: any = jwt.decode(token);
      if (decodeToken) {
        const loginUser = {
          name: decodeToken.name,
          id: decodeToken.id,
          email: decodeToken.email,
        };
        setUsuario(loginUser);
      }
    }
  }, [router]);

  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'h-screen w-full',
      )}
    >
      {/* Sidebar a la izquierda */}
      <SidebarComponent open={open} setOpen={setOpen} />

      {/* Contenido principal a la derecha */}
      <div className="flex-1 container p-4 ml-auto">
        {usuario && (
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src="/path/to/avatar.jpg" alt={usuario.name} />
              <AvatarFallback>{usuario.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">{usuario.name}</h2>
            <p className="text-gray-500">{usuario.email}</p>
            <Button
              className="mt-4"
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
            >
              <LogOut className="mr-2" />
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
