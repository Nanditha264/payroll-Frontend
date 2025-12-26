import  { useEffect, useState } from 'react';
import HRLayout from '../../components/HRLayout';
import { Clock,  Filter, UserCheck, UserX } from 'lucide-react';
import api from '../../utils/api';

const AttendanceList = () => {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch Attendance Data
  const fetchAttendance = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    
    // ✅ FIX: Path changed to '/users/employees'
    const res = await api.get('/users/employees', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // The res.data will now contain the populated employee objects
    setAttendance(res.data);
  } catch (err) {
    console.error("Failed to load attendance", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchAttendance(); }, [selectedDate]);

  return (
    <HRLayout>
      <div className="space-y-6">
        
        {/* Top Header & Date Picker */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div>
                <h2 className="text-xl font-bold text-white">Daily Attendance</h2>
                <p className="text-slate-400 text-sm">Monitoring staff clock-in/out status</p>
            </div>
            <div className="flex items-center gap-3">
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-white px-4 py-2 rounded-lg outline-none focus:border-emerald-500"
                />
                <button className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                    <Filter size={20} />
                </button>
            </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg"><UserCheck /></div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase">Present</p>
                    <h3 className="text-2xl font-bold text-white">{attendance.length}</h3>
                </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-red-500/10 text-red-500 rounded-lg"><UserX /></div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase">Absent</p>
                    <h3 className="text-2xl font-bold text-white">0</h3>
                </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg"><Clock /></div>
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase">Avg. Clock In</p>
                    <h3 className="text-2xl font-bold text-white">09:15 AM</h3>
                </div>
            </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-200 font-bold uppercase text-xs tracking-wider">
                        <tr>
                            <th className="p-4 pl-6">Employee</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Clock In</th>
                            <th className="p-4">Clock Out</th>
                            <th className="p-4">Total Hours</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">Syncing attendance data...</td></tr>
                        ) : attendance.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-500">No employees found.</td></tr>
                        ) : (
                            attendance.map((emp) => (
                            <tr key={emp._id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="p-4 pl-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 border border-slate-700 uppercase">
                                    {/* ✅ Dynamic Initials */}
                                    {emp.userId?.name?.[0] || emp.userId?.email?.[0]}
                                    </div>
                                    <div>
                                    {/* ✅ Dynamic Name and Department */}
                                    <p className="text-white font-medium">{emp.userId?.name || emp.userId?.email?.split('@')[0]}</p>
                                    <p className="text-xs text-slate-500">{emp.departmentId?.name || 'General'}</p>
                                    </div>
                                </div>
                                </td>
                                <td className="p-4">
                                <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    PRESENT
                                </span>
                                </td>
                                {/* These fields remain static until you create a dedicated Attendance model fetch */}
                                <td className="p-4 text-slate-300 font-mono text-xs">09:00 AM</td>
                                <td className="p-4 text-slate-300 font-mono text-xs">06:00 PM</td>
                                <td className="p-4">
                                <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-200">9h 00m</span>
                                </td>
                            </tr>
                            ))
                        )}
                        </tbody>
                </table>
            </div>
        </div>
      </div>
    </HRLayout>
  );
};

export default AttendanceList;