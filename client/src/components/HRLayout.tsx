import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Clock, DollarSign, LogOut, Briefcase } from 'lucide-react';

const HRLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/hr/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/hr/employees', label: 'Employee Directory', icon: <Users size={20} /> },
    { path: '/hr/attendance', label: 'Attendance', icon: <Clock size={20} /> },
    { path: '/hr/leaves', label: 'Leave Requests', icon: <Calendar size={20} /> },
    { path: '/hr/payroll', label: 'Run Payroll', icon: <DollarSign size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Sidebar - HR Theme (Emerald/Teal Accents) */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="p-2 bg-emerald-600 rounded-lg">
            <Briefcase className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-emerald-400">
            PayrollPro <span className="text-slate-500 text-xs ml-1">HR</span>
          </span>
        </div>

        <div className="p-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">HR Manager</span>
            </div>

            <nav className="space-y-1">
            {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    }`}
                >
                    {item.icon}
                    <span className="font-medium text-sm">{item.label}</span>
                </Link>
                );
            })}
            </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-400 hover:bg-red-900/10 hover:text-red-300 w-full px-4 py-3 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 bg-slate-950">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800/50">
          <h2 className="text-2xl font-bold text-white">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Overview'}
          </h2>
          
        </header>

        {children}
      </main>
    </div>
  );
};

export default HRLayout;