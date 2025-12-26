
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import UserManagement from './pages/UserManagement';
import Organization from './pages/Organization';
import AuditLogs from './pages/AuditLogs';
import HRDashboard from './pages/hr/HRDashboard';
import EmployeeList from './pages/hr/EmployeeList';

import LeaveList from './pages/hr/LeaveList';
import AttendanceList from './pages/hr/AttendanceList';
import PayrollRun from './pages/hr/PayrollRun';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeePayslips from './pages/employee/Payslips';

import EmployeeLeaves from './pages/employee/Leaves';
import EmployeeProfile from './pages/employee/Profile';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/hr/attendance" element={<AttendanceList />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/employees" element={<EmployeeList />} />
        <Route path="/hr/leaves" element={<LeaveList />} />
        
        <Route path="/hr/payroll" element={<PayrollRun />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/payslips" element={<EmployeePayslips />} />
        
        <Route path="/employee/leaves" element={<EmployeeLeaves />} />
        <Route path="/employee/profile" element={<EmployeeProfile />} />
        {/* We will add Register and Onboarding next */}
      </Routes>
    </Router>
  );
}

export default App;