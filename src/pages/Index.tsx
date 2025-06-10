
import React from 'react';
import TopBar from '../components/TopBar';
import LoginForm from '../components/LoginForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="container mx-auto px-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
