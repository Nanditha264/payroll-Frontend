import  { useEffect, useState } from 'react';
import HRLayout from '../../components/HRLayout';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import api from '../../utils/api';

const LeaveList = () => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  const fetchLeaves = async () => {
  try {
    const token = localStorage.getItem('token');
    // ✅ FIX: Path changed to '/hr/leaves'
    const res = await api.get('/hr/leaves', { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    
    setLeaves(res.data);
    
    // Calculate Stats dynamically based on real data
    setStats({
      pending: res.data.filter((l: any) => l.status === 'PENDING').length,
      approved: res.data.filter((l: any) => l.status === 'APPROVED').length,
      rejected: res.data.filter((l: any) => l.status === 'REJECTED').length
    });
  } catch (err) {
    console.error("Failed to load leaves", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchLeaves(); }, []);

  const handleStatus = async (id: string, newStatus: string) => {
  try {
    const token = localStorage.getItem('token');
    // ✅ FIX: Path changed to '/hr/leaves/${id}'
    await api.put(`/hr/leaves/${id}`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchLeaves(); // Refresh the list after update
  } catch (err) {
    alert("Failed to update status");
  }
};

  return (
    <HRLayout>
      <div className="space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBox label="Pending Requests" value={stats.pending} color="text-amber-400" bg="bg-amber-500/10" icon={<Clock />} />
            <StatBox label="Approved" value={stats.approved} color="text-emerald-400" bg="bg-emerald-500/10" icon={<CheckCircle />} />
            <StatBox label="Rejected" value={stats.rejected} color="text-red-400" bg="bg-red-500/10" icon={<XCircle />} />
        </div>

        {/* List */}
        <h3 className="text-lg font-bold text-white mt-4">Pending Approvals</h3>
        <div className="space-y-4">
            {loading ? <p className="text-slate-400">Loading...</p> : 
             leaves.filter(l => l.status === 'PENDING').length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center text-slate-500">All caught up! No pending requests.</div>
             ) : (
                leaves.filter(l => l.status === 'PENDING').map((leave) => (
                    <div key={leave._id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                {leave.userId?.email?.[0].toUpperCase()}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{leave.userId?.email?.split('@')[0]}</h4>
                                <div className="flex items-center gap-3 mt-1 text-sm text-slate-400">
                                    <span className="text-emerald-400 font-bold uppercase">{leave.type}</span>
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-300 mt-2 text-sm italic">"{leave.reason}"</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => handleStatus(leave._id, 'REJECTED')} className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10">Reject</button>
                            <button onClick={() => handleStatus(leave._id, 'APPROVED')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-bold">Approve</button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </HRLayout>
  );
};

const StatBox = ({ label, value, color, bg, icon }: any) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between items-center">
        <div>
            <p className="text-slate-400 text-sm">{label}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${bg} ${color}`}>{icon}</div>
    </div>
);

export default LeaveList;