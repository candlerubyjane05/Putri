
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Library, 
  BookOpen, 
  ArrowLeftRight, 
  Database, 
  LogOut,
  User as UserIcon,
  Search,
  MessageSquare,
  Users
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return <>{children}</>;

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.DOSEN, UserRole.MAHASISWA] },
    { name: 'Repository Digital', path: '/repository', icon: Library, roles: [UserRole.ADMIN, UserRole.DOSEN, UserRole.MAHASISWA] },
    { name: 'Inventaris Buku', path: '/inventory', icon: BookOpen, roles: [UserRole.ADMIN] },
    { name: 'Sirkulasi (Pinjam/Kembali)', path: '/circulation', icon: ArrowLeftRight, roles: [UserRole.ADMIN] },
    { name: 'Manajemen Anggota', path: '/users', icon: Users, roles: [UserRole.ADMIN] },
    { name: 'Asisten AI', path: '/ai-assistant', icon: MessageSquare, roles: [UserRole.ADMIN, UserRole.DOSEN, UserRole.MAHASISWA] },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-400">DigiLib FH UNDANA</h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">FH UNDANA Environment</p>
        </div>
        
        <nav className="flex-1 mt-4 px-4 space-y-2">
          {menuItems.filter(item => item.roles.includes(user.role)).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center flex-1 max-w-xl">
             <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Cari koleksi, buku, atau peraturan..."
                  className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
             </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{user.nama}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <UserIcon size={20} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
