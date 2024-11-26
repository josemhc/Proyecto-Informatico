'use client';
import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/Input';
import { cn } from '../utils/cn';
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from '@tabler/icons-react';
import { emailDominio } from "@/lib/utils";

interface SignupFormDemoProps {
  onSignInClick?: () => void;
}

interface Errors {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export function SignupFormDemo({ onSignInClick }: SignupFormDemoProps) {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [generalMessage, setGeneralMessage] = useState('');

  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralMessage('');
    const newErrors: Errors = {};

    // Validar campos
    if (!name) newErrors.name = 'El nombre es obligatorio';
    if (!lastname) newErrors.lastname = 'El apellido es obligatorio';
    if (!email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!emailDominio.test(email)) {
      newErrors.email = 'El formato del correo es inválido';
    }

    if (!password) newErrors.password = 'La contraseña es obligatoria';
    if (!confirmPassword)
      newErrors.confirmPassword = 'Confirmar contraseña es obligatorio';
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!acceptPolicy) {
      newErrors.general = 'Debe aceptar la política de privacidad';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Enviar los datos al servidor para iniciar el proceso de registro
      const response = await fetch(
        'http://localhost:5000/api/users/initiate-registration',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, lastname, email, password }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message) {
          setErrors({ general: errorData.message });
        } else {
          throw new Error('Error al iniciar el proceso de registro');
        }
      } else {
        setGeneralMessage(
          'Registro exitoso. Por favor, verifique su correo electrónico.',
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setGeneralMessage(`Error al enviar el formulario: ${error.message}`);
      } else {
        setGeneralMessage('Error desconocido al enviar el formulario');
      }
    }
  };

  // Funcion que se ejecuta cuando se hace click en el boton de iniciar sesion
  const handleSignInClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onSignInClick) {
      onSignInClick();
    }
  };

  return (
    <div className="max-w-sm sm:max-w-md w-full mx-auto rounded-none md:rounded-2xl p-2 sm:p-4 md:p-8 shadow-input bg-white dark:bg-black h-auto sm:h-30">
      <h2 className="text-lg sm:font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Bienvenid@ a EcoMed4D
      </h2>
      <p className="text-neutral-600 text-xs sm:text-sm max-w-sm mt-2 dark:text-neutral-300">
        Registrese llenando los siguientes datos.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Nombre</Label>
            <Input
              id="firstname"
              placeholder="Cristian Camilo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="lastname">Apellido</Label>
            <Input
              id="lastname"
              placeholder="Dominguez Gutierrez"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            {errors.lastname && (
              <p style={{ color: 'red' }}>{errors.lastname}</p>
            )}
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            placeholder="cristian@hotmail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p style={{ color: 'red' }}>{errors.confirmPassword}</p>
          )}
        </LabelInputContainer>

        {generalMessage && (
          <p
            style={{
              color: generalMessage.includes('exitoso') ? 'green' : 'red',
            }}
          >
            {generalMessage}
          </p>
        )}

        {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={acceptPolicy}
              onChange={(e) => setAcceptPolicy(e.target.checked)}
              className="form-checkbox"
            />
            <span className="text-sm text-neutral-600 dark:text-neutral-300">
              He leido y acepto la{' '}
              <button
                type="button"
                onClick={() => setShowPolicyModal(true)}
                className="text-blue-500 underline"
              >
                Política de Tratamientos y condiciones de uso
              </button>
            </span>
          </label>
        </div>
        {showPolicyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full overflow-y-auto max-h-[80vh]">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Política de Tratamiento de Datos Personales y Condiciones de Uso
              </h2>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-4">
                <p>
                  Bienvenido a EcoMed4D. A continuación, se describe nuestra
                  política de tratamiento de datos personales y condiciones de
                  uso para los usuarios de nuestra aplicación.
                </p>

                <h3 className="font-semibold">1. Recolección de Datos</h3>
                <p>
                  EcoMed4D recolecta y almacena los siguientes datos de los
                  médicos usuarios de la plataforma:
                  <ul className="list-disc list-inside ml-4">
                    <li>Nombre, apellido, correo electrónico, y contraseña.</li>
                    <li>
                      Datos de pacientes creados en la aplicación: nombre,
                      apellido, y archivos asociados (por ejemplo, videos de
                      ecografías y otros documentos).
                    </li>
                  </ul>
                </p>

                <h3 className="font-semibold">2. Uso de los Datos</h3>
                <p>
                  Los datos recopilados en EcoMed4D se utilizarán para:
                  <ul className="list-disc list-inside ml-4">
                    <li>Permitir el registro de médicos en la aplicación.</li>
                    <li>
                      Administrar y organizar el perfil y los datos de los
                      pacientes.
                    </li>
                    <li>
                      Facilitar el envío de archivos médicos a las direcciones
                      de correo electrónico proporcionadas.
                    </li>
                  </ul>
                </p>
                <p>
                  Los pacientes no tendrán acceso a la plataforma ni a sus
                  propios perfiles, ya que el médico es quien maneja y
                  administra esta información.
                </p>

                <h3 className="font-semibold">
                  3. Almacenamiento y Seguridad de los Datos
                </h3>
                <p>
                  EcoMed4D se compromete a proteger los datos personales y
                  sensibles que almacena, implementando medidas de seguridad
                  avanzadas para prevenir el acceso no autorizado, la
                  alteración, divulgación o destrucción de la información. La
                  información de los pacientes y médicos se almacena en
                  servidores seguros y se mantendrá por un período de tiempo
                  adecuado para cumplir con las finalidades descritas en esta
                  política.
                </p>

                <h3 className="font-semibold">4. Derechos del Usuario (Médico)</h3>
                <p>
                  Los médicos usuarios de EcoMed4D tienen los siguientes
                  derechos:
                  <ul className="list-disc list-inside ml-4">
                    <li>
                      <strong>Acceso y corrección</strong>: Pueden revisar y
                      actualizar sus datos personales en cualquier momento.
                    </li>
                    <li>
                      <strong>Supresión de datos</strong>: Tienen derecho a
                      solicitar la eliminación de sus datos personales y los
                      datos de sus pacientes de la plataforma, sujeto a las
                      normativas legales vigentes.
                    </li>
                    <li>
                      <strong>Revocación del consentimiento</strong>: En
                      cualquier momento, pueden revocar el consentimiento para
                      el tratamiento de sus datos, lo que puede afectar su
                      capacidad para utilizar la plataforma.
                    </li>
                  </ul>
                </p>

                <h3 className="font-semibold">5. Aceptación de la Política</h3>
                <p>
                  Al utilizar EcoMed4D, el médico confirma que ha leído y acepta
                  esta Política de Tratamiento de Datos Personales y Condiciones
                  de Uso. Si no está de acuerdo con alguno de los términos aquí
                  descritos, no debe utilizar la plataforma.
                </p>
                <p>
                  Para cualquier consulta o ejercicio de derechos sobre los
                  datos, puede ponerse en contacto con nosotros en la dirección
                  de soporte proporcionada en la plataforma.
                </p>
              </div>
              <button
                className="bg-blue-500 text-white mt-4 px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setShowPolicyModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Registrarse &rarr;
          <BottomGradient />
        </button>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] mt-3"
          type="button"
          onClick={onSignInClick}
        >
          o Inicie sesión &rarr;
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
