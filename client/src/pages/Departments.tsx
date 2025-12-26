import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Building, DollarSign } from 'lucide-react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Departments = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/departments', { name: newName, budget: Number(newBudget) }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setNewName('');
      setNewBudget('');
      fetchDepartments(); // Refresh list
    } catch (err) {
      alert('Failed to create department');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-slate-400">Manage cost centers and budgets</p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
                Back to Dashboard
            </button>
            <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20"
            >
            <Plus className="w-4 h-4" /> Add Department
            </button>
        </div>
      </div>

      {/* Add Department Form (Collapsible) */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="max-w-5xl mx-auto mb-8 bg-slate-900 border border-slate-800 p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold mb-4">New Department Details</h3>
          <form onSubmit={handleCreate} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-slate-400 mb-1">Department Name</label>
              <input 
                type="text" 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 outline-none focus:border-blue-500"
                placeholder="e.g. Engineering"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
              />
            </div>
            <div className="w-48">
              <label className="block text-sm text-slate-400 mb-1">Monthly Budget</label>
              <input 
                type="number" 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 outline-none focus:border-green-500"
                placeholder="50000"
                value={newBudget}
                onChange={e => setNewBudget(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg font-bold">
              Save
            </button>
          </form>
        </motion.div>
      )}

      {/* Departments Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {departments.map((dept) => (
          <motion.div 
            key={dept._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-800 rounded-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                <Building className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
                ID: {dept._id.slice(-4)}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
            <div className="flex items-center text-slate-400 text-sm">
              <DollarSign className="w-4 h-4 mr-1" />
              Budget: ${dept.budget.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Departments;