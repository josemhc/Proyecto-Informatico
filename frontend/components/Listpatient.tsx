'use client';
import { cn } from '../utils/cn';
import { useState, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { SidebarComponent } from './Sidebar';
import jwt from 'jsonwebtoken';

// Interfaz Datarow usando _id
interface Datarow {
  _id: string;
  name: string;
  email: string;
  files: File[];
}

export default function PatientList() {
  const [open, setOpen] = useState(false);
  const [patients, setPatients] = useState<Datarow[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPatients, setFilteredPatients] = useState<Datarow[]>([]);
  const [usuario, setUsuario] = useState<{ name: string; id: string } | null>(
    null,
  ); 

  // Efecto para obtener los datos del paciente y validar el token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No estás autenticado. Redirigiendo al login.');
          window.location.href = '/';
          return;
        }
        // Decodificar el token y establecer el usuario autenticado
        const decodedToken: any = jwt.decode(token);
        if (decodedToken) {
          setUsuario({ name: decodedToken.name, id: decodedToken.id });
        }

        // Hacer la solicitud GET con las cookies incluidas
        const response = await fetch('http://localhost:5000/api/patients', {
          method: 'GET',
          credentials: 'include', // Incluir cookies en la solicitud
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          console.error('Acceso no autorizado. Redirigiendo al login.');
          window.location.href = '/dashboard';
          return;
        }

        const result: Datarow[] = await response.json();
        // Asegurarse de que cada paciente tenga un array de archivos
        const patientsWithFiles = result.map((patient) => ({
          ...patient,
          files: patient.files || [],
        }));
        setPatients(patientsWithFiles);
        setFilteredPatients(patientsWithFiles);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    patientCC: string,
  ) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length > 2) {
        toast.warn('Solo puedes seleccionar hasta 2 archivos', {
          position: 'top-right',
        });
        return;
      }
      const updatedPatients = patients.map((patient) =>
        patient._id === patientCC
          ? { ...patient, files: selectedFiles }
          : patient,
      );
      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);
    }
  };

  const handleRemoveFile = (patientCC: string, fileIndex: number) => {
    const updatedPatients = patients.map((patient) =>
      patient._id === patientCC
        ? {
            ...patient,
            files: patient.files.filter((_, index) => index !== fileIndex),
          }
        : patient,
    );
    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients);
  };

  const handleSendFile = async (patient: Datarow) => {
    if (patient.files.length > 0) {
      try {
        const formData = new FormData();
        patient.files.forEach((file) => formData.append('files', file));
        formData.append('patientId', patient._id);
        formData.append('patientName', patient.name);
        formData.append('patientEmail', patient.email);

        const response = await fetch(
          'http://localhost:5000/api/patients/send-file',
          {
            method: 'POST',
            credentials: 'include',
            body: formData,
          },
        );

        if (response.ok) {
          toast.success('Archivo enviado exitosamente', {
            position: 'top-right',
          });
          const updatedPatients = patients.map((p) =>
            p._id === patient._id ? { ...p, files: [] } : p,
          );
          setPatients(updatedPatients);
          setFilteredPatients(updatedPatients);
        } else {
          toast.error('Error al enviar el archivo', {
            position: 'top-right',
          });
        }
      } catch (error) {
        toast.error('Error al enviar el archivo', {
          position: 'top-right',
        });
      }
    } else {
      toast.warn(
        'Por favor, seleccione un archivo primero para este paciente',
        {
          position: 'top-right',
        },
      );
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredPatients(patients); // Restablece la lista completa
    }
  }, [searchTerm, patients]);

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setFilteredPatients(patients); // Muestra todos si el término de búsqueda está vacío
      return;
    }
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen w-full">

      <SidebarComponent open={open} setOpen={setOpen} />

      <div className="flex-1 container p-4 ml-auto">
        <div className="mb-4 flex items-center space-x-2">
        <Input
            type="text"
            placeholder="Buscar por nombre o email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar por nombre o email"
          />
          <Button onClick={handleSearch} style={{ cursor: 'pointer' }}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Adjuntar Archivos</TableHead>
              <TableHead>Enviar Archivos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(filteredPatients) &&
              filteredPatients.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.mp4,.mvk,.avi,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileChange(e, row._id)}
                      className="max-w-xs cursor-pointer"
                      multiple
                    />
                    {row.files.length > 0 && (
                      <div className="mt-1">
                        {row.files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <p className="text-sm text-green-500">
                              {file.name}
                            </p>
                            <Button
                              onClick={() => handleRemoveFile(row._id, index)}
                              className="text-red-500"
                              style={{ cursor: 'pointer' }}
                            >
                              Eliminar
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSendFile(row)}
                      disabled={row.files.length === 0}
                      className={row.files.length > 0 ? 'bg-green-500' : ''}
                      style={{ cursor: 'pointer' }}
                    >
                      Enviar Archivos
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <ToastContainer />
    </div>
  );
}
