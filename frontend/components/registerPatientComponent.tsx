'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Input } from './ui/Input';
import { cn } from '../utils/cn';
import { SidebarComponent } from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Errors {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterPatientComponent() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [generalMessage, setGeneralMessage] = useState('');

  const [open, setOpen] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralMessage('');

    const newErrors: Errors = {};

    // Validar campos
    if (!name) newErrors.name = 'El nombre es obligatorio';
    if (!lastname) newErrors.lastname = 'El apellido es obligatorio';
    if (!email) newErrors.email = 'El correo es obligatorio';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    if (!confirmPassword)
      newErrors.confirmPassword = 'Confirmar contraseña es obligatorio';
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/patients/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, lastname, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message) {
          setErrors({ general: errorData.message });
        } else {
          throw new Error(
            'Error al iniciar el proceso de registro del paciente',
          );
        }
      } else {
        toast.success(
          'Registro de paciente exitoso. Enviando correo de confirmación al paciente...',
          {
            position: 'top-right',
          },
        );
        setName('');
        setLastname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setGeneralMessage(`Error al enviar el formulario: ${error.message}`);
      } else {
        setGeneralMessage('Error desconocido al enviar el formulario');
      }
    }
  };

  return (
    <div
      className={cn(
        'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'h-screen w-full',
      )}
    >
      {/* Sidebar reutilizable */}
      <SidebarComponent open={open} setOpen={setOpen} />

      {/* Contenido principal */}
      <div className="flex-1 container p-4 ml-auto">
        <div className="p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 w-full h-full">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
            Registro de Paciente
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Por favor, complete los siguientes datos para registrar a un
            paciente.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <LabelInputContainer>
                <Label htmlFor="firstname">Nombre</Label>
                <Input
                  id="firstname"
                  placeholder="Nombre del paciente"
                  type="text"
                  required
                  className="bg-white text-black placeholder-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-red-500 text-sm">{errors.name}</p>
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                  id="lastname"
                  placeholder="Apellido del paciente"
                  type="text"
                  required
                  className="bg-white text-black placeholder-black"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
                <p className="text-red-500 text-sm">{errors.lastname}</p>
              </LabelInputContainer>
            </div>

            <LabelInputContainer>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                placeholder="paciente@example.com"
                type="email"
                required
                className="bg-white text-black placeholder-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.email}</p>
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                required
                className="bg-white text-black placeholder-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.password}</p>
            </LabelInputContainer>

            <LabelInputContainer>
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                id="confirm-password"
                placeholder="••••••••"
                type="password"
                required
                className="bg-white text-black placeholder-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            </LabelInputContainer>
            {errors.general && (
              <p className="text-red-500 text-sm">{errors.general}</p>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 font-medium text-gray-800 bg-white rounded-md shadow-lg hover:shadow-xl transition duration-200 ease-in-out"
            >
              Registrar un paciente &rarr;
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn('flex flex-col space-y-2 w-full', className)}>
    {children}
  </div>
);
