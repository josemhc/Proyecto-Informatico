
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from './ui/label';
import { Input } from './ui/Input';
import { cn } from '../utils/cn';
import { IconBrandGoogle } from '@tabler/icons-react';
import { emailDominio } from "@/lib/utils";

interface SignInFormDemoProps {
  onSignUpClick?: () => void;
}

export function SignInFormDemo({ onSignUpClick }: SignInFormDemoProps) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Paciente');

  // Estados para manejar errores y mensajes
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Funcion que se ejecuta cuando se envia el formulario para registrarse

  const handleForgotPassword = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/users/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            'Error al enviar el correo de restablecimiento de contraseña.',
        );
        return;
      }

      setMessage(
        'Correo de restablecimiento de contraseña enviado. Por favor, revise su bandeja de entrada.',
      );
    } catch (error) {
      console.error(
        'Error al enviar el correo de restablecimiento de contraseña: ',
        error,
      );
      setError(
        'Error al enviar el correo de restablecimiento de contraseña. Inténtelo de nuevo más tarde.',
      );
    }
  };

  const emailDominio = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para correos válidos

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('El correo es obligatorio.');
      return;
    } else if (!emailDominio.test(email)) {
      setError('El formato del correo es inválido.');
      return;
    }

    if (!password) {
      setError('La contraseña es obligatoria.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: role }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError('El correo no está registrado.');
        } else if (response.status === 400) {
          setError('Algunos de los datos es incorrecto, verifique por favor');
        } else {
          setError('Error al iniciar sesión. Inténtelo de nuevo más tarde.');
        }
        return;
      }

      localStorage.setItem('token', data.token);
      setMessage('Inicio de sesión exitoso.');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión: ', error);
      setError('Error al iniciar sesión. Inténtelo de nuevo más tarde.');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Bienvenid@ a EcoMed4D
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Inicie sesión con sus credenciales.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="role">Seleccione su rol</Label>
          <select
            id="role"
            className="border rounded-md p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Paciente">Paciente</option>
            <option value="Medico">Medico</option>
          </select>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            placeholder="cristian@hotmail.com"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </LabelInputContainer>

        <p className="text-red-500 text-sm">{error}</p>
        <p className="text-green-500 text-sm">{message}</p>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-3"
          type="submit"
        >
          Inicie sesión &rarr;
          <BottomGradient />
        </button>

        {role !== 'Paciente' && (
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-3"
            type="button"
            onClick={onSignUpClick}
          >
            o Registrese &rarr;
            <BottomGradient />
          </button>
        )}

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-3"
          type="button"
          onClick={handleForgotPassword}
        >
          ¿Contraseña olvidada? &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4"></div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  );
};
