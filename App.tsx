
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Repository from './pages/Repository';
import Circulation from './pages/Circulation';
import Inventory from './pages/Inventory';
import AiAssistant from './pages/AiAssistant';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = () => {
    setUser(null);
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/repository" element={<Repository userRole={user.role} />} />
              <Route path="/circulation" element={<Circulation />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              {/* Other routes can be added here */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
