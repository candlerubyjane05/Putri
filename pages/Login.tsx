
import React, { useState } from 'react';
import { User } from '../types';
import { store } from '../store';
import { LogIn, Library } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = store.login(username);
    if (user) {
      onLogin(user);
    } else {
      setError('Username tidak ditemukan. Coba: admin, dosen, mhs');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 bg-blue-600 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Library size={40} />
          </div>
          <h2 className="text-2xl font-bold">DigiLib FH UNDANA</h2>
          <p className="text-blue-100 text-sm mt-2">Sistem Informasi Perpustakaan Hukum</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Masukkan username anda"
              required
            />
            <p className="text-xs text-slate-400 mt-2">Contoh login: admin, dosen, atau mhs</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Kata Sandi</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              disabled
            />
            <p className="text-xs text-slate-400 mt-2">Password diabaikan untuk demonstrasi ini</p>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-blue-500/30"
          >
            <LogIn size={20} />
            <span>Masuk ke Sistem</span>
          </button>
        </form>
        
        <div className="px-8 pb-8 text-center">
          <p className="text-xs text-slate-400">© 2024 Fakultas Hukum Universitas Nusa Cendana</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
