import React, { useState, useEffect } from 'react';
import EmployeeLayout from '../../components/EmployeeLayout';
import { Plus, X } from 'lucide-react';
import api from '../../utils/api';

const Leaves = () => {
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'Casual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchHistory = async () => {
    try {
      const res = await api.get('/employee/dashboard', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.leaves) setHistory(res.data.leaves);
    } catch (err) {
      console.error("Failed to fetch leaves", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  // ✅ New handleSubmit function to store data in the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      // Sends data to the /api/employee/apply-leave endpoint
      await api.post('/employee/apply-leave', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("✅ Leave request submitted successfully!");
      setShowModal(false);
      fetchHistory(); // Refresh the table automatically
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit request. Ensure your profile is set up.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EmployeeLayout title="Leave Requests">
      {/* ... Header remains same ... */}
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Leave Requests</h2>
           <p className="text-slate-500 text-sm">Submit and track your leave requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
          <Plus size={18}/> Request Leave
        </button>
      </div>

      {/* Leave History Tracking Table */}
<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
  <table className="w-full text-left text-sm">
    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
      <tr>
        <th className="p-4">Leave Type</th>
        <th className="p-4">Duration</th>
        <th className="p-4">Reason</th>
        <th className="p-4 text-center">Status</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      {loading ? (
        <tr><td colSpan={4} className="p-10 text-center text-slate-400 italic">Updating history...</td></tr>
      ) : history.length === 0 ? (
        <tr><td colSpan={4} className="p-10 text-center text-slate-400">No leave history found.</td></tr>
      ) : (
        history.map((leave) => (
          <tr key={leave._id} className="hover:bg-slate-50/50 transition-colors">
            <td className="p-4">
              <span className="font-bold text-slate-700 uppercase tracking-tight">{leave.type}</span>
            </td>
            <td className="p-4">
              <div className="text-slate-800 font-medium">
                {new Date(leave.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - 
                {new Date(leave.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </td>
            <td className="p-4 text-slate-500 max-w-xs truncate italic">
              "{leave.reason}"
            </td>
            <td className="p-4 text-center">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm border ${
                leave.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-200' : 
                leave.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                'bg-red-50 text-red-600 border-red-200'
              }`}>
                {leave.status}
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

      {/* ✅ Modal with Form Fields */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Request New Leave</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Leave Type</label>
                <select 
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Earned">Earned Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input type="date" required className="w-full border border-slate-200 rounded-lg p-2.5" 
                    onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input type="date" required className="w-full border border-slate-200 rounded-lg p-2.5" 
                    onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Reason</label>
                <textarea required rows={3} className="w-full border border-slate-200 rounded-lg p-2.5" placeholder="Reason for leave..."
                  onChange={e => setFormData({...formData, reason: e.target.value})} />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-all disabled:bg-slate-300"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
};
export default Leaves;