import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './components/dashboard/Dashboard';
import MembersPage from './components/members/MembersPage';
import MemberDetailPage from './pages/MemberDetailPage';
import HealthMetricsPage from './components/health/HealthMetricsPage';
import ConversationsPage from './components/conversations/ConversationsPage';
import ConversationDetailPage from './pages/ConversationDetailPage';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import MemberForm from './components/forms/MemberForm';
import HealthMetricForm from './components/forms/HealthMetricForm';
import ConversationForm from './components/forms/ConversationForm';
import DataManagementDashboard from './components/DataManagement/DataManagementDashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/members/:id" element={<MemberDetailPage />} />
          <Route path="/members/new" element={
            <MemberForm 
              onSave={() => window.history.back()} 
              onCancel={() => window.history.back()} 
            />
          } />
          <Route path="/members/:id/edit" element={
            <MemberForm 
              onSave={() => window.history.back()} 
              onCancel={() => window.history.back()} 
            />
          } />
          <Route path="/health-metrics" element={<HealthMetricsPage />} />
          <Route path="/health-metrics/new/:memberId" element={
            <HealthMetricForm 
              memberId={window.location.pathname.split('/').pop() || ""} 
              onSave={() => window.history.back()} 
              onCancel={() => window.history.back()} 
            />
          } />
          <Route path="/conversations" element={<ConversationsPage />} />
          <Route path="/conversations/:id" element={<ConversationDetailPage />} />
          <Route path="/conversations/new/:memberId" element={
            <ConversationForm 
              memberId={window.location.pathname.split('/').pop() || ""} 
              onSave={() => window.history.back()} 
              onCancel={() => window.history.back()} 
            />
          } />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/data-management" element={<DataManagementDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
