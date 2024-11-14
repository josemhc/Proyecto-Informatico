// frontend/pages/verify-email.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState('Verificando...');

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/users/verify-email?token=${token}`);
          const data = await response.json();

          if (response.ok) {
            setMessage(data.message);
          } else {
            setMessage(data.message || 'Error al verificar el correo electrónico.');
          }
        } catch (error) {
          setMessage('Error al verificar el correo electrónico.');
        }
      };

      verifyEmail();
    }
  }, [token]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#000000', // Negro de fondo
        color: '#ffffff', // Texto blanco
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>Verificación de Correo Electrónico</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{message}</p>
      <Link href="/">
        <button
          style={{
            backgroundColor: '#000000', // Botón negro
            color: '#ffffff', // Texto blanco
            padding: '1rem 2rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '2px solid #ffffff',
            cursor: 'pointer',
          }}
        >
          Volver al inicio
        </button>
      </Link>
    </div>
  );
};

export default VerifyEmail;