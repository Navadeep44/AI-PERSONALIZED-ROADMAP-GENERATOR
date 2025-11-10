
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import type { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState<boolean>(false);

  const handleLogin = (name: string) => {
    setUser({
      id: 'user-1',
      name: name,
      email: `${name.toLowerCase()}@example.com`,
      skill: null,
      duration: null,
      progress: 0,
    });
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  if (showAuth) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <LandingPage onGetStarted={handleGetStarted} />
    </div>
  );}
