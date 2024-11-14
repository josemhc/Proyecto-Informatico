'use client';
import React, { useEffect, useState } from 'react';
import { SidebarComponent } from './Sidebar';
import { cn } from '../utils/cn';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Dashboard = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debe iniciar sesión para acceder a esta página.');
      router.push('/');
    }
  }, [router]);

  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'h-screen w-full',
      )}
    >
      <SidebarComponent open={open} setOpen={setOpen} />

      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 w-full h-full">
          
          {/* Contenedor superior con el logo */}
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 mr-6">
              <img src="/Logo_ECOMED4D.png" alt="Eco Med 4D Logo" width={100} height={100} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Bienvenido a EcoMed4D
            </h1>
          </div>

          {/* Información de la aplicación */}
          <div className="text-gray-700 dark:text-gray-300 text-justify leading-relaxed mx-4 md:mx-10">
            <p>
              EcoMed4D es una plataforma diseñada para ofrecer un soporte completo tanto para médicos como para pacientes. Aquí podrás acceder a herramientas que facilitan la gestión y el análisis de ecografías y diagnósticos.
            </p>

            {/* Funciones para Médicos */}
            <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800 dark:text-white">
              Funciones para Médicos:
            </h2>
            <ul className="list-disc list-inside ml-5 leading-relaxed">
              <li>Convertir videos de ecografías de formato AVI a MP4.</li>
              <li>Registrar y gestionar datos de los pacientes.</li>
              <li>Enviar archivos de ecografías y diagnósticos a los pacientes.</li>
            </ul>

            {/* Funciones para Pacientes */}
            <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800 dark:text-white">
              Funciones para Pacientes:
            </h2>
            <ul className="list-disc list-inside ml-5 leading-relaxed">
              <li>Ver los archivos enviados por su médico.</li>
              <li>Acceder a ecografías y diagnósticos de manera segura y organizada.</li>
            </ul>

            {/* Mensaje de agradecimiento */}
            <p className="mt-6 text-gray-600 dark:text-gray-400 leading-relaxed">
              Gracias por confiar en Eco Med 4D para gestionar tus ecografías y diagnósticos. ¡Estamos aquí para ayudarte a obtener los mejores resultados!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
