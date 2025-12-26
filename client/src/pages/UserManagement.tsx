import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Plus, Search} from 'lucide-react';
import api from '../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'EMPLOYEE',
    designation: '',
    departmentId: '658a... (dummy)' // We will fix this dropdown later
  });

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    const res = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);


  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
        const token = localStorage.getItem('token');
        await api.put(`/users/${userId}`, updates, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('User Updated!');
        fetchUsers(); // Refresh list to see changes
    } catch (err) {
        alert('Failed to update user');
    }
  };

 const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // ✅ FIX: Create a clean payload object
      // If departmentId is the dummy text, send null or don't send it at all
      const payload = {
        ...formData,
        departmentId: formData.departmentId.includes('dummy') ? null : formData.departmentId
      };

      await api.post('/users', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowModal(false);
      fetchUsers();
      alert('User Created Successfully');
      
      // Reset form
      setFormData({
         email: '', password: '', role: 'EMPLOYEE', designation: '', departmentId: '' 
      });

    } catch (err: any) {
      console.error(err); // Check console for detailed error
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <AdminLayout>
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        
        {/* Table Header / Controls */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div className="relative w-64">
                <Search className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-blue-500 outline-none"
                />
            </div>
            <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            >
                <Plus size={16} /> Add User
            </button>
        </div>

        {/* Users Table */}
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-slate-200 font-medium border-b border-slate-800">
                    <tr>
                        <th className="p-4 pl-6">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Created</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
        {users.map((user) => (
            <tr key={user._id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-bold">
                        {/* ✅ SAFETY CHECK: Only try to get the first letter if email exists */}
                        {user.email ? user.email[0].toUpperCase() : "?"} 
                    </div>
                    <div>
                        <p className="text-slate-200 font-medium">
                            {user.email || <span className="text-red-400 italic">No Email</span>}
                        </p>
                    </div>
                </td>
                <td className="p-4">
                    {/* ROLE BADGE */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        user.role === 'HR' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                        {user.role}
                    </span>
                </td>
                <td className="p-4">
                    {/* STATUS BADGE */}
                    <span className={`px-2 py-1 rounded text-xs border capitalize ${
                        user.status === 'ACTIVE' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                        {/* ✅ SAFETY CHECK: If status is missing, show 'unknown' instead of crashing */}
                        {(user.status || 'UNKNOWN').toLowerCase()}
                    </span>
                </td>
                <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                    {/* ACTION BUTTONS */}
                    <div className="flex justify-end gap-2">
                        {/* Role Toggle Button (Demo) */}
                        {user.role === 'EMPLOYEE' && (
                            <button 
                                onClick={() => handleUpdateUser(user._id, { role: 'HR' })}
                                className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 px-2 py-1 rounded border border-slate-700"
                            >
                                Promote to HR
                            </button>
                        )}
                        
                        {/* Status Toggle Button */}
                        <button 
                            onClick={() => handleUpdateUser(user._id, { status: user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE' })}
                            className={`text-xs px-2 py-1 rounded border ${
                                user.status === 'ACTIVE' 
                                ? 'bg-red-900/20 border-red-900/50 text-red-400 hover:bg-red-900/40' 
                                : 'bg-green-900/20 border-green-900/50 text-green-400 hover:bg-green-900/40'
                            }`}
                        >
                            {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        </button>
                    </div>
                </td>
            </tr>
        ))}
    </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-xl font-bold mb-4">Add New User</h3>
                <form onSubmit={handleCreate} className="space-y-4">
    {/* Email Input */}
    <div>
        <label className="block text-sm text-slate-400 mb-1">Email</label>
        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
            type="email" placeholder="user@company.com" required 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            value={formData.email}
        />
    </div>

    {/* Password Input */}
    <div>
        <label className="block text-sm text-slate-400 mb-1">Password</label>
        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
            type="password" placeholder="••••••••" required 
            onChange={e => setFormData({...formData, password: e.target.value})}
            value={formData.password}
        />
    </div>

    {/* ✅ NEW: Designation Input (Fixes the 500 Error) */}
    <div>
        <label className="block text-sm text-slate-400 mb-1">Designation</label>
        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white" 
            type="text" placeholder="e.g. Senior Developer" required 
            onChange={e => setFormData({...formData, designation: e.target.value})}
            value={formData.designation}
        />
    </div>

    {/* Role Select */}
    <div>
        <label className="block text-sm text-slate-400 mb-1">Role</label>
        <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
            onChange={e => setFormData({...formData, role: e.target.value})}
            value={formData.role}
        >
            <option value="EMPLOYEE">Employee</option>
            <option value="HR">HR Manager</option>
            <option value="ADMIN">Admin</option>
        </select>
    </div>

    {/* Buttons */}
    <div className="flex gap-3 mt-6">
        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">Cancel</button>
        <button type="submit" className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold">Create User</button>
    </div>
</form>
            </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagement;