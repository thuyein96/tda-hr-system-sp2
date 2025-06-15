// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import TopBar from '@/components/TopBar';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Optional: redirect if already logged in
  if (isLoggedIn) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="container mx-auto px-4 py-8">
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      </div>
    </div>
  );
};

export default LoginPage;
// This file serves as the entry point for the login page in a Next.js application.
// It imports the necessary components and handles the login state.
// The `LoginForm` component is responsible for handling user authentication.