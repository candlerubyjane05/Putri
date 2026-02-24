
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Repository from './pages/Repository';
import Circulation from './pages/Circulation';
import Inventory from './pages/Inventory';
import UserManagement from './pages/UserManagement';
import AiAssistant from './pages/AiAssistant';
import Opac from './pages/Opac';
import Profile from './pages/Profile';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard user={user} />} />
              <Route path="/repository" element={<Repository userRole={user.role} />} />
              <Route path="/circulation" element={<Circulation />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              <Route path="/opac" element={<Opac user={user} />} />
              <Route path="/profile" element={<Profile user={user} onUpdateUser={handleUpdateUser} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
