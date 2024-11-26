"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        setError("Token no válido.");
        return;
    }

    if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
    }

    try {
        console.log('Enviando solicitud con token:', token);
        console.log('Enviando solicitud con contraseña:', password);

        const response = await fetch("http://localhost:5000/api/users/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error en la respuesta del servidor:', data);
            setError(data.message || "Error al restablecer la contraseña.");
            return;
        }

        setMessage("Contraseña restablecida con éxito.");
        router.push("/");
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        setError("Error al conectar con el servidor.");
    }
};

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
      <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>Restablecer Contraseña</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        Introduzca su nueva contraseña.
      </p>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Nueva Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '5px',
              border: '1px solid #ffffff',
              backgroundColor: '#000000',
              color: '#ffffff',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirmar Nueva Contraseña</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '5px',
              border: '1px solid #ffffff',
              backgroundColor: '#000000',
              color: '#ffffff',
            }}
          />
        </div>

        <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
        <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>

        <button
          type="submit"
          style={{
            backgroundColor: '#000000', // Botón negro
            color: '#ffffff', // Texto blanco
            padding: '1rem 2rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '2px solid #ffffff',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          Restablecer Contraseña &rarr;
        </button>
      </form>

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