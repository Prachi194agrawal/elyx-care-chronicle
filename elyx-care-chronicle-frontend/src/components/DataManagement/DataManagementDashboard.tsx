import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api';
import MemberForm from '../forms/MemberForm';
import HealthMetricForm from '../forms/HealthMetricForm';
import ConversationForm from '../forms/ConversationForm';

interface DataState {
  members: any[];
  healthMetrics: any[];
  conversations: any[];
}

const DataManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [data, setData] = useState<DataState>({
    members: [],
    healthMetrics: [],
    conversations: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load data when component mounts or tab changes
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'members':
          const membersResult = await apiService.getAllMembers();
          console.log('📥 Members loaded:', membersResult);
          setData((prev: DataState) => ({ ...prev, members: membersResult.data || [] }));
          break;
        case 'healthMetrics':
          const metricsResult = await apiService.getAllHealthMetrics();
          console.log('📥 Health metrics loaded:', metricsResult);
          setData((prev: DataState) => ({ ...prev, healthMetrics: metricsResult.data || [] }));
          break;
        case 'conversations':
          const conversationsResult = await apiService.getAllConversations();
          console.log('📥 Conversations loaded:', conversationsResult);
          setData((prev: DataState) => ({ ...prev, conversations: conversationsResult.data || [] }));
          break;
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      alert('Failed to load data. Please try again.');
    }
    setIsLoading(false);
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
    console.log(`➕ Adding new ${activeTab.slice(0, -1)}`);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowForm(true);
    console.log(`✏️ Editing ${activeTab.slice(0, -1)}:`, item);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    console.log(`🗑️ Deleting ${activeTab.slice(0, -1)} with ID:`, id);
    
    try {
      let result;
      switch (activeTab) {
        case 'members':
          result = await apiService.deleteMember(id);
          break;
        case 'healthMetrics':
          result = await apiService.deleteHealthMetric(id);
          break;
        default:
          console.log('Delete not implemented for this type yet');
          return;
      }
      
      console.log('✅ Delete successful:', result);
      alert('Item deleted successfully!');
      loadData(); // Reload data
    } catch (error) {
      console.error('❌ Delete error:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleSave = async (newData: any) => {
    console.log(`💾 Saving ${activeTab.slice(0, -1)}:`, newData);
    setShowForm(false);
    setEditingItem(null);
    await loadData(); // Reload data to show the new/updated item
    alert(`${editingItem ? 'Updated' : 'Created'} successfully!`);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
    console.log('❌ Form cancelled');
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'members':
        return (
          <MemberForm
            member={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      case 'healthMetrics':
        const memberId = data.members[0]?.id || 'demo-member-id'; // Use first member or demo ID
        return (
          <HealthMetricForm
            memberId={memberId}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      case 'conversations':
        const memberIdForConv = data.members[0]?.id || 'demo-member-id';
        return (
          <ConversationForm
            memberId={memberIdForConv}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      default:
        return null;
    }
  };

  const renderDataTable = () => {
    const currentData = data[activeTab as keyof DataState] || [];

    if (isLoading) {
      return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
    }

    if (currentData.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h3>No {activeTab} found</h3>
          <p>Click "Add New" to create your first {activeTab.slice(0, -1)}</p>
        </div>
      );
    }

    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              {activeTab === 'members' && (
                <>
                  <th style={tableHeaderStyle}>Name</th>
                  <th style={tableHeaderStyle}>Email</th>
                  <th style={tableHeaderStyle}>Phone</th>
                  <th style={tableHeaderStyle}>Engagement</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </>
              )}
              {activeTab === 'healthMetrics' && (
                <>
                  <th style={tableHeaderStyle}>Member</th>
                  <th style={tableHeaderStyle}>Type</th>
                  <th style={tableHeaderStyle}>Value</th>
                  <th style={tableHeaderStyle}>Date</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </>
              )}
              {activeTab === 'conversations' && (
                <>
                  <th style={tableHeaderStyle}>Member</th>
                  <th style={tableHeaderStyle}>Subject</th>
                  <th style={tableHeaderStyle}>Priority</th>
                  <th style={tableHeaderStyle}>Status</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item: any, index: number) => (
              <tr key={item.id || index} style={{ borderBottom: '1px solid #eee' }}>
                {activeTab === 'members' && (
                  <>
                    <td style={tableCellStyle}>{item.name}</td>
                    <td style={tableCellStyle}>{item.email}</td>
                    <td style={tableCellStyle}>{item.phone || 'N/A'}</td>
                    <td style={tableCellStyle}>{item.engagementLevel}</td>
                    <td style={tableCellStyle}>
                      <button onClick={() => handleEdit(item)} style={editButtonStyle}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} style={deleteButtonStyle}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
                {activeTab === 'healthMetrics' && (
                  <>
                    <td style={tableCellStyle}>{item.member?.name || 'Unknown'}</td>
                    <td style={tableCellStyle}>{item.type}</td>
                    <td style={tableCellStyle}>{item.value} {item.unit}</td>
                    <td style={tableCellStyle}>{new Date(item.timestamp).toLocaleDateString()}</td>
                    <td style={tableCellStyle}>
                      <button onClick={() => handleDelete(item.id)} style={deleteButtonStyle}>
                        Delete
                      </button>
                    </td>
                  </>
                )}
                {activeTab === 'conversations' && (
                  <>
                    <td style={tableCellStyle}>{item.member?.name || 'Unknown'}</td>
                    <td style={tableCellStyle}>{item.subject}</td>
                    <td style={tableCellStyle}>{item.priority}</td>
                    <td style={tableCellStyle}>{item.status}</td>
                    <td style={tableCellStyle}>
                      <button onClick={() => handleEdit(item)} style={editButtonStyle}>
                        View
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📊 Data Management Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Add, edit, and manage your healthcare data. All changes are saved to the backend database.
      </p>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        {[
          { key: 'members', label: '👥 Members', count: data.members?.length || 0 },
          { key: 'healthMetrics', label: '📊 Health Metrics', count: data.healthMetrics?.length || 0 },
          { key: 'conversations', label: '💬 Conversations', count: data.conversations?.length || 0 }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              ...tabButtonStyle,
              backgroundColor: activeTab === tab.key ? '#007bff' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#007bff'
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={handleAdd} style={addButtonStyle}>
          ➕ Add New {activeTab.slice(0, -1).replace(/([A-Z])/g, ' $1').trim()}
        </button>
        <button onClick={loadData} style={refreshButtonStyle} disabled={isLoading}>
          🔄 Refresh Data
        </button>
        <span style={{ color: '#666', fontSize: '14px' }}>
          {isLoading ? 'Loading...' : `${data[activeTab as keyof DataState]?.length || 0} items`}
        </span>
      </div>

      {/* Form or Data Table */}
      {showForm ? (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          {renderForm()}
        </div>
      ) : (
        renderDataTable()
      )}

      {/* Data Flow Indicator */}
      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#e7f3ff', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>🔄 Data Flow:</strong> Frontend ↔ Backend ↔ Database
        <br />
        <span style={{ color: '#666' }}>
          All operations (Create, Read, Update, Delete) are performed through API calls to your backend server.
        </span>
      </div>
    </div>
  );
};

// Styles
const tabButtonStyle = {
  padding: '10px 20px',
  border: '1px solid #007bff',
  backgroundColor: 'transparent',
  borderRadius: '4px',
  marginRight: '5px',
  cursor: 'pointer',
  marginBottom: '10px'
};

const addButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const refreshButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#17a2b8',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left' as const,
  borderBottom: '2px solid #dee2e6',
  fontWeight: 'bold'
};

const tableCellStyle = {
  padding: '12px',
  borderBottom: '1px solid #dee2e6'
};

const editButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#ffc107',
  color: 'black',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  marginRight: '5px',
  fontSize: '12px'
};

const deleteButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '12px'
};

export default DataManagementDashboard;
