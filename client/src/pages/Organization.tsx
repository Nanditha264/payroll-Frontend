import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Save, Building, DollarSign } from 'lucide-react';
import api from '../utils/api';

const Organization = () => {
  // 1. Define flat state for easier management
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [address, setAddress] = useState('');
  
  // Keep numbers as strings initially to prevent "NaN" typing issues
  const [payDay, setPayDay] = useState('1'); 
  const [pfRate, setPfRate] = useState('12');
  const [esiRate, setEsiRate] = useState('0.75');

  // 2. Fetch Data
  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/organization', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            if (res.data) {
                // Safely set data if it exists
                setCompanyName(res.data.companyName || '');
                setCompanyEmail(res.data.companyEmail || '');
                setAddress(res.data.address || '');
                
                // Handle nested config
                if (res.data.payrollConfig) {
                    setPayDay(String(res.data.payrollConfig.payDay || '1'));
                    setPfRate(String(res.data.payrollConfig.pfRate || '12'));
                    setEsiRate(String(res.data.payrollConfig.esiRate || '0.75'));
                }
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
        }
    };
    fetchSettings();
  }, []);

  // 3. Save Data
  const handleUpdate = async () => {
    try {
        const payload = {
            companyName,
            companyEmail,
            address,
            payrollConfig: {
                payDay: Number(payDay),
                pfRate: Number(pfRate),
                esiRate: Number(esiRate)
            }
        };

        console.log("Sending Payload:", payload); // DEBUG LOG

        const token = localStorage.getItem('token');
        const res = await api.put('/organization', payload, { 
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Server Response:", res.data); // DEBUG LOG
        alert('Settings Saved Successfully!');
        
    } catch (err) {
        console.error("Save Failed:", err);
        alert('Failed to save settings');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div>
            <h1 className="text-3xl font-bold text-white">Organization Settings</h1>
            <p className="text-slate-400">Configure company-wide settings and defaults</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Company Info */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Building size={20} /></div>
                    <h3 className="text-lg font-bold text-white">Company Information</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Company Name</label>
                        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none" 
                            value={companyName} 
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Company Email</label>
                        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none" 
                            value={companyEmail} 
                            onChange={(e) => setCompanyEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Address</label>
                        <textarea className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none h-24" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Payroll Config */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><DollarSign size={20} /></div>
                    <h3 className="text-lg font-bold text-white">Payroll Configuration</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Pay Day (of month)</label>
                        <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-green-500 outline-none" 
                            value={payDay} 
                            onChange={(e) => setPayDay(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">PF Rate (%)</label>
                        <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-green-500 outline-none" 
                            value={pfRate} 
                            onChange={(e) => setPfRate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">ESI Rate (%)</label>
                        <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-green-500 outline-none" 
                            value={esiRate} 
                            onChange={(e) => setEsiRate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

        </div>

        <div className="flex justify-end">
            <button 
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20"
            >
                <Save size={18} /> Save Changes
            </button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Organization;