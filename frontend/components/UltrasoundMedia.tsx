'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '../utils/cn';
import {
  IconCalendar,
  IconHospital,
  IconUser,
  IconBuildingHospital,
} from '@tabler/icons-react';
import { SidebarComponent } from './Sidebar';
import { useRouter } from 'next/navigation';

export default function Dashboard_UltrasoundMedia() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debe iniciar sesión para acceder a esta página.');
        router.push('/');
        return;
      }
    }
  }, [router]);
  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'h-screen w-full', // Cambiado de "max-w-7xl" a "w-full"
      )}
    >
      <SidebarComponent open={open} setOpen={setOpen} />
      <div className="flex-1 container p-4 ml-auto">
        <div className="flex flex-1">
          <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
            {/* Cuatro rectángulos superiores */}
            <div className="flex gap-2">
              <div className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 flex items-center">
                <IconCalendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 mr-2" />
                <div className="text-black">
                  <div>Fecha: 2023-10-06</div>
                  <div>Hora: 09:22</div>
                </div>
              </div>
              <div className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 flex items-center">
                <IconHospital className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 mr-2" />
                <div className="text-black">
                  <div>Doctor: Dr. Smith</div>
                  <div>Cargo: Pediatra</div>
                </div>
              </div>
              <div className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 flex items-center">
                <IconUser className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 mr-2" />
                <div className="text-black">
                  <div>Paciente: Bebe 7 meses</div>
                  <div>John</div>
                </div>
              </div>
              <div className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 flex items-center">
                <IconBuildingHospital className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0 mr-2" />
                <div className="text-black">
                  <div>Hospital: General Hospital</div>
                  <div>Lugar: Nueva York</div>
                </div>
              </div>
            </div>

            {/* Dos cuadros con videos */}
            <div className="flex gap-2 flex-1">
              {[...new Array(2)].map((i) => (
                <div
                  key={1 + i}
                  className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4 flex flex-col items-center"
                >
                  <h2 className="text-center mb-4 text-black">
                    Número de video {i + 1}
                  </h2>
                  <video controls className="w-full max-w-2xl rounded-lg">
                    <source src="ruta_del_video.mp4" type="video/mp4" />
                    Tu navegador no soporta la etiqueta de video.
                  </video>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
