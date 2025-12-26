import React, { useEffect, useState } from 'react';
import HRLayout from '../../components/HRLayout';
import { Search, Plus, X } from 'lucide-react';
import api from '../../utils/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Edit State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null); // ✅ Added for Edit
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    designation: '',
    departmentId: '',
    salary: '',
    password: 'Password@123',
    role: 'EMPLOYEE'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [empRes, deptRes] = await Promise.all([
        api.get('/users/employees', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/departments', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
    } catch (err: any) {
      console.error("Load Failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ✅ Consolidated Submit (Handles both Create and Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      if (editId) {
        // 1. UPDATE logic
        await api.put(`/users/employees/${editId}`, formData, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        alert('✅ Employee Updated Successfully!');
      } else {
        // 2. CREATE logic
        await api.post('/users', formData, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        alert('✅ Employee Added Successfully!');
      }

      // 3. Reset State & Refresh
      setShowModal(false);
      setEditId(null);
      setFormData({ 
        email: '', designation: '', departmentId: '', salary: '', 
        password: 'Password@123', role: 'EMPLOYEE' 
      }); 
      fetchData(); 
    } catch (err: any) {
      alert(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HRLayout>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden min-h-[600px] relative">
        
        {/* Controls */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div className="relative w-72">
                <Search className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search employees..." 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500"
                />
            </div>
            <button 
                onClick={() => {
                  setEditId(null); // Reset to Create mode
                  setFormData({ email: '', designation: '', departmentId: '', salary: '', password: 'Password@123', role: 'EMPLOYEE' });
                  setShowModal(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
            >
                <Plus size={16} /> Add Employee
            </button>
        </div>

        {/* List Table */}
        <div className="p-6">
            {loading ? <p className="text-white">Loading...</p> : (
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-950 text-slate-200 uppercase text-xs">
                        <tr>
                          <th className="p-4">Email</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Designation</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {employees.map(e => (
                        <tr key={e._id} className="hover:bg-slate-800/30">
                            <td className="p-4 text-white font-medium">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                                        {e.userId?.email?.[0] || '?'}
                                    </div>
                                    {e.userId?.email || 'N/A'}
                                </div>
                            </td>
                            <td className="p-4">{e.departmentId?.name || "No Dept"}</td>
                            <td className="p-4">{e.designation}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs ${
                                    e.userId?.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                    {e.userId?.status || 'ACTIVE'}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                {/* ✅ ADDED EDIT BUTTON */}
                                <button 
                                    onClick={() => {
                                        setEditId(e._id); // Trigger Update mode
                                        setFormData({
                                            email: e.userId?.email || '',
                                            designation: e.designation,
                                            departmentId: e.departmentId?._id || '',
                                            salary: e.salary,
                                            password: '', // Password not changed on edit
                                            role: 'EMPLOYEE'
                                        });
                                        setShowModal(true);
                                    }}
                                    className="text-blue-400 hover:text-blue-300 font-bold text-xs"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>

        {/* MODAL */}
        {showModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">
                          {editId ? 'Update Employee' : 'Add New Employee'}
                        </h3>
                        <button onClick={() => setShowModal(false)} className="text-slate-400"><X size={20}/></button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Email</label>
                            <input 
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white disabled:opacity-50" 
                                type="email" 
                                value={formData.email}
                                disabled={!!editId} // Cannot change email on edit
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Designation</label>
                            <input 
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
                                type="text" 
                                value={formData.designation}
                                onChange={e => setFormData({...formData, designation: e.target.value})} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Base Salary (₹)</label>
                            <input 
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
                                type="number" 
                                value={formData.salary}
                                onChange={e => setFormData({...formData, salary: e.target.value})} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-1">Department</label>
                            <select 
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                value={formData.departmentId}
                                onChange={e => setFormData({...formData, departmentId: e.target.value})} 
                                required
                            >
                                <option value="">-- Select Department --</option>
                                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 text-slate-300 p-2 rounded">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 text-white p-2 rounded hover:bg-emerald-500 font-bold">
                                {isSubmitting ? 'Saving...' : editId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </HRLayout>
  );
};

export default EmployeeList;