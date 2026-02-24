
import React, { useState } from 'react';
import { User } from '../types';
import { store } from '../store';
import { LogIn, Library } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = store.login(username, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Identitas atau Password salah. Gunakan Username atau NIM.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-10 bg-blue-600 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Library size={44} />
          </div>
          <h2 className="text-3xl font-black tracking-tight">DigiLib FH UNDANA</h2>
          <p className="text-blue-100 font-medium mt-2">Sistem Informasi Perpustakaan Hukum</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-10 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-in shake duration-300">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username / NIM</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
              placeholder="Masukkan Username atau NIM..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kata Sandi</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-3 transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            <LogIn size={20} />
            <span>Masuk Sistem</span>
          </button>
        </form>
        
        <div className="px-10 pb-10 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            © 2024 Fakultas Hukum UNDANA
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
