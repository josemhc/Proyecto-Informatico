import React, { useEffect, useState } from 'react';
import RegisterPatientComponent from '@/components/registerPatientComponent';
import ProtectedRoute from '@/components/ProtectedRoute';
import jwt from 'jsonwebtoken';

const RegisterPatient = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt.decode(token);
      if (decodedToken) {
        console.log('Decoded token:', decodedToken);
        setUserId(decodedToken.id);
      }
    }
  }, []);

  return (
    <ProtectedRoute allowedRoles={['Medico']} userId={userId}>
      <div className="pb-20 pt-36">
        <div className="h-screen w-full dark:bg-black-100 bg-white flex items-center justify-center absolute top-0 left-0 ">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <RegisterPatientComponent />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default RegisterPatient;