'use client';
import { useState } from 'react';
import { SignupFormDemo } from '@/components/SignUpForm';
import { SignInFormDemo } from '@/components/SignInForm';
import { Hero } from '../components/Hero';

export default function Home() {
  const [showSignInForm, setShowSignInForm] = useState(true); // Inicializa como true para mostrar el formulario de inicio de sesión primero

  const handleSignInClick = () => {
    setShowSignInForm(true);
  };

  const handleSignUpClick = () => {
    setShowSignInForm(false);
  };

  return (
    <main>
      <div className="max-w-7xl w-full">
        <Hero />
      </div>
      <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          {showSignInForm && (
            <SignInFormDemo onSignUpClick={handleSignUpClick} />
          )}
          {!showSignInForm && (
            <SignupFormDemo onSignInClick={handleSignInClick} />
          )}
        </div>
      </div>
    </main>
  );
}