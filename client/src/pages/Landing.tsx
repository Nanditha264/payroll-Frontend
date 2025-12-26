
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, DollarSign, Users } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          
        
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 rounded-full border border-slate-700 hover:border-blue-500 hover:text-blue-400 transition-all text-sm font-medium"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 mt-16 lg:mt-24 text-center relative z-10">
        
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            Enterprise Grade Payroll
          </span>
          
          <h1 className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Manage Payroll <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Without the Chaos.
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            The complete solution for  immutable financial records, and automated salary generation.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Get Started Now <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg font-semibold transition-all">
              View Documentation
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8 text-left pb-20">
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
            title="Audit-Ready Security"
            desc="Every action is logged. Immutable records ensure complete financial transparency."
          />
          <FeatureCard 
            icon={<DollarSign className="w-8 h-8 text-blue-400" />}
            title="Smart Cost Centers"
            desc="Track expenses by department. Know exactly where your budget goes in real-time."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-purple-400" />}
            title="Role-Based Access"
            desc="Strict isolation between Admin, HR, and Employee interfaces for maximum security."
          />
        </div>
      </main>
    </div>
  );
};

// Helper Component for Features
const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all"
  >
    <div className="mb-4 p-3 bg-slate-950 rounded-lg w-fit border border-slate-800">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-200 mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </motion.div>
);

export default Landing;