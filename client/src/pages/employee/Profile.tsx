import  { useEffect, useState } from 'react';
import EmployeeLayout from '../../components/EmployeeLayout';
import { User as UserIcon, Mail } from 'lucide-react';
import api from '../../utils/api';

const Profile = () => {
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/employee/dashboard', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProfileData(res.data.profile);
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profileData) return <EmployeeLayout title="Profile">Loading...</EmployeeLayout>;

  return (
    <EmployeeLayout title="Profile">
      <div className="space-y-6">
        {/* Dynamic Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
           <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <UserIcon size={40}/>
                </div>
                <div>
                   {/* ✅ Dynamically show 'manya' instead of Mike */}
                   <h3 className="text-2xl font-bold text-slate-800">{profileData.userId.name}</h3>
                   <p className="text-slate-400 text-sm">
                     {profileData.employeeId || 'EMP-NEW'} • {profileData.designation || 'Employee'}
                   </p>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfileInput label="Full Name" value={profileData.userId.name} />
              <ProfileInput label="Email Address" value={profileData.userId.email} icon={<Mail size={16}/>} />
              <ProfileInput label="Role" value={profileData.userId.role} />
              <ProfileInput label="Account Status" value={profileData.userId.status} />
           </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

const ProfileInput = ({ label, value, icon }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-800">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-3 text-slate-300">{icon}</div>}
      <input 
        type="text" 
        readOnly 
        value={value} 
        className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 ${icon ? 'pl-10' : 'px-4'} text-sm text-slate-500 outline-none`}
      />
    </div>
  </div>
);

export default Profile;