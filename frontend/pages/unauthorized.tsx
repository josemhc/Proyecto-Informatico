import Link from 'next/link';

export default function Unauthorized() {
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
      <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>No autorizado</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        No tienes permiso para acceder a esta página.
      </p>
      {/* Enlace a la página principal */}
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
}