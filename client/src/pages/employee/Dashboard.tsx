import  { useEffect, useState } from 'react';
import EmployeeLayout from '../../components/EmployeeLayout';
import api from '../../utils/api';
import { DollarSign, Calendar, Clock, AlertCircle } from 'lucide-react';

const EmployeeDashboard = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/employee/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchData();
  }, []);

  if (!data) return <EmployeeLayout title="Dashboard">Loading...</EmployeeLayout>;

  // Destructure for cleaner code
  const { profile, payroll, leaveStats } = data;

  return (
    <EmployeeLayout title="Dashboard">
      <div className="space-y-6">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-sm">Net Salary (Current)</p>
            <div className="flex justify-between items-center mt-2">
              <h3 className="text-2xl font-bold text-slate-800">
                ₹{payroll?.netSalary?.toLocaleString() || '0'}
              </h3>
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><DollarSign size={20}/></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-sm">Designation</p>
            <div className="flex justify-between items-center mt-2">
              <h3 className="text-xl font-bold text-slate-800">{profile?.designation || 'N/A'}</h3>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Calendar size={20}/></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-sm">Leave Balance</p>
            <div className="flex justify-between items-center mt-2">
              <h3 className="text-2xl font-bold text-slate-800">{leaveStats?.balance || 0} days</h3>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><Clock size={20}/></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-sm">Pending Requests</p>
            <div className="flex justify-between items-center mt-2">
              <h3 className="text-2xl font-bold text-slate-800">{leaveStats?.pending || 0}</h3>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><AlertCircle size={20}/></div>
            </div>
          </div>
        </div>

        {/* Salary Details & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border p-8 shadow-sm">
            <div className="flex justify-between mb-6">
              <h4 className="font-bold text-slate-800">
                Salary Breakdown 
                <span className="text-slate-400 font-normal text-sm ml-2">
                  {payroll?.month} {payroll?.year}
                </span>
              </h4>
              <button className="text-blue-600 text-sm font-bold border px-3 py-1 rounded-lg">View Payslip</button>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
               <div>
                 <p className="text-slate-500 text-xs uppercase font-bold">Gross Salary</p>
                 <p className="text-2xl font-bold text-slate-800 mt-1">
                   ₹{payroll?.grossEarnings?.toLocaleString() || '0'}
                 </p>
                 <div className="mt-4 space-y-2 text-sm text-slate-600">
                    {/* These fields assume your Payroll model stores specific breakdowns */}
                    <div className="flex justify-between"><span>Basic</span><span>₹{payroll?.basic?.toLocaleString() || '0'}</span></div>
                    <div className="flex justify-between"><span>HRA</span><span>₹{payroll?.hra?.toLocaleString() || '0'}</span></div>
                 </div>
               </div>
               <div>
                 <p className="text-slate-500 text-xs uppercase font-bold">Deductions</p>
                 <p className="text-2xl font-bold text-red-500 mt-1">
                   -₹{payroll?.totalDeductions?.toLocaleString() || '0'}
                 </p>
                 <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between"><span>Tax</span><span>-₹{payroll?.tax?.toLocaleString() || '0'}</span></div>
                    <div className="flex justify-between"><span>PF</span><span>-₹{payroll?.pf?.toLocaleString() || '0'}</span></div>
                 </div>
               </div>
               <div className="bg-green-50 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                  <p className="text-green-800 text-xs font-bold uppercase">Net Salary</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    ₹{payroll?.netSalary?.toLocaleString() || '0'}
                  </p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"/> Recent Leave Status
            </h4>
            <div className="space-y-3">
              {data.leaves?.slice(0, 3).map((leave: any) => (
                <div key={leave._id} className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-800">
                    {leave.type} request is <span className="font-bold uppercase text-xs">{leave.status}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(leave.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {(!data.leaves || data.leaves.length === 0) && (
                <p className="text-sm text-slate-400">No recent notifications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;