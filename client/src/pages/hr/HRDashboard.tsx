import  { useEffect, useState } from 'react';
import { Users, DollarSign, Clock, FileText, PieChart, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import HRLayout from '../../components/HRLayout'; // ✅ Uses correct layout

const HRDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    monthlyPayroll: 0,
    pendingLeaves: 0,
    departmentDistribution: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/hr/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load HR Stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 3
    }).format(amount);
  };

  if (loading) return <HRLayout><div className="text-white">Loading Dashboard...</div></HRLayout>;

  return (
    <HRLayout>
      <div className="space-y-6">
        
        {/* Welcome Banner */}
        <div className="flex justify-between items-end">
             <div>
                 <p className="text-slate-400">Here's what's happening in your organization today.</p>
             </div>
             <button 
                 onClick={() => navigate('/hr/employees')}
                 className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
             >
                 + Add Employee
             </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard icon={<Users />} label="Total Employees" value={stats.totalEmployees} color="blue" subtext="Active Staff" />
            <StatCard icon={<DollarSign />} label="Monthly Payroll" value={formatCurrency(stats.monthlyPayroll)} color="emerald" subtext="Estimated Cost" />
            <StatCard icon={<Clock />} label="Pending Leaves" value={stats.pendingLeaves} color="amber" subtext="Needs Review" />
            <StatCard icon={<FileText />} label="Pending Expenses" value="₹0" color="purple" subtext="Claims waiting" />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Department Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <PieChart size={20} className="text-blue-400" /> Department Distribution
                </h3>
                <div className="space-y-4">
                    {stats.departmentDistribution.length === 0 ? (
                        <p className="text-slate-500 text-sm py-4 text-center">No department data found.</p>
                    ) : (
                        stats.departmentDistribution.map((dept: any) => (
                            <div key={dept._id} className="group">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="text-slate-300 font-medium">{dept._id}</span>
                                    <span className="text-slate-400">{dept.count} Staff</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                                        style={{ width: `${(dept.count / stats.totalEmployees) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-emerald-400" /> Recent Activity
                </h3>
                <div className="space-y-4">
                     <div className="p-4 bg-slate-950/50 rounded-lg border border-slate-800 flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-slate-200 text-sm font-medium">New Employee Onboarded</p>
                            <p className="text-slate-500 text-xs">System check completed</p>
                        </div>
                        <span className="ml-auto text-xs text-slate-500">2h ago</span>
                     </div>
                </div>
            </div>
        </div>

      </div>
    </HRLayout>
  );
};

// Reusable Stat Card
const StatCard = ({ icon, label, value, color, subtext }: any) => {
    const colors: any = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    };
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-all shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-400 text-sm font-medium">{label}</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{value}</h3>
                    {subtext && <p className={`text-xs mt-2 font-medium ${colors[color].split(' ')[0]}`}>{subtext}</p>}
                </div>
                <div className={`p-3 rounded-lg border ${colors[color]}`}>{icon}</div>
            </div>
        </div>
    );
};

export default HRDashboard;