import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Plus, Trash2, Building } from 'lucide-react';
import api from '../../utils/api';

const DepartmentList = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', budget: '' });

  // 1. Load Departments from DB
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/departments', { headers: { Authorization: `Bearer ${token}` } });
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  // 2. Save New Department to DB
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/departments', formData, { headers: { Authorization: `Bearer ${token}` } });
      
      alert("✅ Department Saved to Database!");
      setShowModal(false);
      setFormData({ name: '', budget: '' });
      fetchDepartments(); // Refresh list
    } catch (err: any) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  // 3. Delete from DB
  const handleDelete = async (id: string) => {
    if(!window.confirm("Delete this department?")) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/departments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchDepartments();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Departments</h2>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex gap-2">
                <Plus size={20} /> Add Department
            </button>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept) => (
                <div key={dept._id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between group">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Building size={16} className="text-blue-400"/> {dept.name}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">Budget: ${dept.budget}</p>
                    </div>
                    <button onClick={() => handleDelete(dept._id)} className="text-slate-600 hover:text-red-400">
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>

        {/* Modal */}
        {showModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-96">
                    <h3 className="text-xl font-bold text-white mb-4">Add Department</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input className="w-full bg-slate-800 border-slate-600 rounded p-2 text-white" 
                            placeholder="Department Name (e.g. Sales)" 
                            onChange={e => setFormData({...formData, name: e.target.value})} required />
                        
                        <input className="w-full bg-slate-800 border-slate-600 rounded p-2 text-white" 
                            type="number" placeholder="Budget (e.g. 50000)" 
                            onChange={e => setFormData({...formData, budget: e.target.value})} required />
                        
                        <div className="flex gap-2 mt-4">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 text-white p-2 rounded">Cancel</button>
                            <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default DepartmentList;