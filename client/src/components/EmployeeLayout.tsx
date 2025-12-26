import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, User, LogOut } from 'lucide-react';

const EmployeeLayout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  const navigate = useNavigate();
  //const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/employee/dashboard' },
    { icon: <FileText size={20} />, label: 'My Payslips', path: '/employee/payslips' },
   
    { icon: <Calendar size={20} />, label: 'Leave Requests', path: '/employee/leaves' },
    { icon: <User size={20} />, label: 'Profile', path: '/employee/profile' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-slate-400 fixed h-full flex flex-col">
        <div className="p-6 flex items-center gap-2 text-white">
          <div className="text-blue-500 font-bold text-2xl">$</div>
          <span className="text-xl font-bold tracking-tight">PayrollPro</span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {item.icon} <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={() => { localStorage.clear(); navigate('/login'); }}
          className="m-4 flex items-center gap-3 px-4 py-3 hover:text-red-400 transition-colors text-sm"
        >
          <LogOut size={20} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="font-bold text-slate-900">{title}</h2>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default EmployeeLayout;