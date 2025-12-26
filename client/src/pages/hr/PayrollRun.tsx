import  { useEffect, useState } from 'react';
import HRLayout from '../../components/HRLayout';
import { Lock, Download, Users, Banknote } from 'lucide-react';
import api from '../../utils/api';

const PayrollRun = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState('December'); // Set to current month
  const [year, setYear] = useState(2025);
  const [isLocked, setIsLocked] = useState(false);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetches real records or a preview from the controller
      const res = await api.get(`/payroll?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRecords(res.data);
      
      // If the first record ID is not a "preview_", it means it's already saved in DB
      const alreadySaved = res.data.length > 0 && !res.data[0]._id.toString().startsWith('preview_');
      setIsLocked(alreadySaved);
    } catch (err) {
      console.error("Payroll Fetch Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayroll(); }, [month, year]);

  const handleLock = async () => {
    if (!window.confirm(`Confirm payroll for ${month} ${year}? This will notify employees.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      // Sends the preview records back to be saved
      await api.post('/payroll', { 
        month, 
        year, 
        records // This array contains the calculated preview data
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("✅ Payroll Processed and Locked!");
      fetchPayroll(); // Refresh to show locked state
    } catch (err) {
      alert("Failed to lock payroll.");
    }
  };

  const totalNet = records.reduce((acc, r) => acc + r.netSalary, 0);

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Header & Controls */}
        <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
            <div className="flex gap-4">
                <select value={month} onChange={e => setMonth(e.target.value)} className="bg-slate-950 border border-slate-700 text-white p-2 rounded-lg outline-none focus:border-blue-500">
                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={year} onChange={e => setYear(Number(e.target.value))} className="bg-slate-950 border border-slate-700 text-white p-2 rounded-lg outline-none focus:border-blue-500">
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                </select>
            </div>
            
            {!isLocked ? (
                <button onClick={handleLock} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
                    <Lock size={18} /> Run Payroll
                </button>
            ) : (
                <div className="flex gap-2">
                   <span className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-lg text-sm font-bold border border-emerald-500/20">LOCKED</span>
                   <button className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-700 transition-all">
                       <Download size={18} /> Export CSV
                   </button>
                </div>
            )}
        </div>

        {/* Dynamic Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-6 shadow-sm">
                 <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl"><Banknote size={32}/></div>
                 <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Net Payable</p>
                    <h3 className="text-3xl font-bold text-white mt-1">₹{totalNet.toLocaleString()}</h3>
                 </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-6 shadow-sm">
                 <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl"><Users size={32}/></div>
                 <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Employees Processed</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{records.length}</h3>
                 </div>
            </div>
        </div>

        {/* Dynamic Payroll Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-slate-200 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                        <th className="p-5">Employee Email</th>
                        <th className="p-5 text-right">Basic</th>
                        <th className="p-5 text-right">Gross</th>
                        <th className="p-5 text-right text-red-400">Deductions</th>
                        <th className="p-5 text-right text-emerald-400">Net Salary</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {loading ? (
                        <tr><td colSpan={5} className="p-12 text-center animate-pulse text-slate-500">Generating Payroll Preview...</td></tr>
                    ) : (
                      records.map((r) => (
                        <tr key={r._id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-5">
                                <p className="font-bold text-white">{r.employeeId?.userId?.email || "System User"}</p>
                                <p className="text-[10px] text-slate-500">{r.employeeId?.designation}</p>
                            </td>
                            <td className="p-5 text-right">₹{r.basic.toLocaleString()}</td>
                            <td className="p-5 text-right">₹{r.grossEarnings.toLocaleString()}</td>
                            <td className="p-5 text-right text-red-400">-₹{r.totalDeductions.toLocaleString()}</td>
                            <td className="p-5 text-right text-emerald-400 font-bold text-lg">₹{r.netSalary.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </HRLayout>
  );
};

export default PayrollRun;