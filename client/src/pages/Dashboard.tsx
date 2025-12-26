import  { useEffect, useState } from 'react';
import { Users, DollarSign, FileText, UserCheck, Activity, Clock } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, activeEmployees: 0 });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper: Format Time (e.g. "2 mins ago")
  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Parallel Fetch
        const [usersRes, logsRes] = await Promise.all([
             api.get('/users', { headers }),
             api.get('/audit', { headers })
        ]);

        // Stats Logic
        const users = usersRes.data;
        setStats({
            totalUsers: users.length,
            activeEmployees: users.filter((u: any) => u.role === 'EMPLOYEE' && u.status === 'ACTIVE').length
        });

        // Logs Logic
        setRecentLogs(logsRes.data);
      } catch (err) {
        console.error("Dashboard Load Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <AdminLayout><div className="p-8 text-white">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<Users />} label="Total Users" value={stats.totalUsers} color="blue" />
            <StatCard icon={<UserCheck />} label="Active Employees" value={stats.activeEmployees} color="green" />
            <StatCard icon={<DollarSign />} label="Payroll Runs" value="12" color="indigo" />
            <StatCard icon={<FileText />} label="Pending Requests" value="5" color="amber" />
        </div>

        {/* Detailed Recent Activity Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity size={20} className="text-blue-400" /> System Activity Log
                </h3>
            </div>

            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-slate-200 uppercase text-xs font-semibold tracking-wider">
                    <tr>
                        <th className="p-4 pl-6">User</th>
                        <th className="p-4">Action</th>
                        <th className="p-4">Details</th>
                        <th className="p-4 text-right">Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {recentLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-slate-800/30 transition-colors">
                            
                            {/* 1. User Info Column */}
                            <td className="p-4 pl-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20">
                                        {log.userId?.name ? log.userId.name[0] : 'S'}
                                    </div>
                                    <div>
                                        <p className="text-slate-200 font-medium">
                                            {log.userId?.name || 'System'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {log.userId?.email || 'Automated'}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* 2. Action Badge Column */}
                            <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                                    log.action === 'LOGIN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                    log.action === 'CREATE_USER' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                    'bg-slate-700/50 text-slate-300 border-slate-600'
                                }`}>
                                    {log.action.replace('_', ' ')}
                                </span>
                            </td>

                            {/* 3. Description Column */}
                            <td className="p-4">
                                <p className="text-slate-300">{log.target}</p>
                                {log.details && <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>}
                            </td>

                            {/* 4. Time Column */}
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-1 text-xs text-slate-500">
                                    <Clock size={12} />
                                    {timeAgo(log.createdAt)}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {recentLogs.length === 0 && (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500">No activity found yet.</td></tr>
                    )}
                </tbody>
            </table>
        </div>

      </div>
    </AdminLayout>
  );
};

// Simple Stat Card Component
const StatCard = ({ icon, label, value, color }: any) => {
    const colors: any = {
        blue: "text-blue-400 bg-blue-500/10",
        green: "text-emerald-400 bg-emerald-500/10",
        indigo: "text-indigo-400 bg-indigo-500/10",
        amber: "text-amber-400 bg-amber-500/10",
    };
    return (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900 flex items-center justify-between shadow-sm">
            <div>
                <p className="text-slate-400 text-sm font-medium">{label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${colors[color]}`}>{icon}</div>
        </div>
    );
};

export default Dashboard;