import  { useEffect, useState } from 'react';
import EmployeeLayout from '../../components/EmployeeLayout';
import { FileText, Download, Eye } from 'lucide-react';
import api from '../../utils/api';

const Payslips = () => {
  const [slips, setSlips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayslips = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/employee/payslips', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSlips(res.data);
      } catch (err) {
        console.error("Failed to fetch payslips", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayslips();
  }, []);

  return (
    <EmployeeLayout title="My Payslips">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">View and download your monthly payslips</p>
          <select className="bg-white border border-slate-200 p-2 rounded-lg text-sm outline-none">
            <option>2024</option>
            <option>2025</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-slate-400">Loading payslips...</p>
          ) : slips.length === 0 ? (
            <p className="text-slate-400 col-span-3">No payslips found.</p>
          ) : (
            slips.map((slip, i) => (
              <div key={slip._id || i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800">{slip.month} {slip.year}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-1 inline-block bg-blue-50 text-blue-600">
                      Available
                    </span>
                  </div>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20}/></div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Gross</span>
                    <span className="font-bold text-slate-700">₹{slip.grossEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Deductions</span>
                    <span className="font-bold text-red-400">-₹{slip.totalDeductions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-100">
                    <span className="text-slate-800 font-bold">Net Salary</span>
                    <span className="text-emerald-600 font-bold">₹{slip.netSalary.toLocaleString()}</span>
                  </div>
                </div>

                {/* ✅ INTEGRATED FUNCTIONAL BUTTONS HERE */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => alert(`Detailed Breakdown for ${slip.month} ${slip.year}:\nGross: ₹${slip.grossEarnings}\nPF: ₹${slip.pf}\nTax: ₹${slip.tax}\nNet: ₹${slip.netSalary}`)}
                    className="flex items-center justify-center gap-2 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    <Eye size={14}/> View
                  </button>

                  <button 
                    onClick={() => window.print()} 
                    className="flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors"
                  >
                    <Download size={14}/> Download
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default Payslips;