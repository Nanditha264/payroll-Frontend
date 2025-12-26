import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const [designation, setDesignation] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.post('/users/onboarding', { designation }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Setup Complete!');
      navigate('/dashboard'); // We will build this next
    } catch (err) {
      console.error(err);
      alert('Failed to save details');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to Skillverse</h2>
        <p className="text-slate-400 mb-8">Let's set up your profile.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Your Designation / Job Title</label>
            <input 
              type="text" 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
              placeholder="e.g. Senior Developer or HR Manager"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg w-full">
            Complete Setup
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;