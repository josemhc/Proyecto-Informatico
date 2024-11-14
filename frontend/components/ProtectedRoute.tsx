// components/ProtectedRoute.tsx
import Unauthorized from '@/pages/unauthorized';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
  userId: string | null;
};

const ProtectedRoute = ({ children, allowedRoles, userId }: ProtectedRouteProps) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async (userId: string) => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/role/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    if (userId) {
      fetchUserRole(userId);
    }
  }, [userId]);

  useEffect(() => {
    console.log('User role:', userRole);
    console.log('Allowed roles:', allowedRoles);
    if (userRole && !allowedRoles.includes(userRole)) {
      console.log('Redirecting to /unauthorized');
      router.push('/unauthorized'); // Redirige a una página de no autorizado
    }
  }, [allowedRoles, userRole, router]);

  if (userRole === null) {
    console.log('Loading...'); // Log para verificar el estado de carga
    setTimeout(() => {
      return <Unauthorized />;
    }, 2000); // Retraso de 2 segundos
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    console.log('User role not allowed'); // Log para verificar el estado de roles no permitidos
    return null; // O un componente de carga
  }

  console.log('User role allowed, rendering children'); // Log para verificar el estado de roles permitidos
  return <>{children}</>;
};

export default ProtectedRoute;