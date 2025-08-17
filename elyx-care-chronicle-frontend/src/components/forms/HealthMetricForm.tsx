import React, { useState } from 'react';
import { apiService } from '../../services/api';

interface HealthMetricFormProps {
  memberId: string;
  onSave: (metric: any) => void;
  onCancel: () => void;
}

const HealthMetricForm: React.FC<HealthMetricFormProps> = ({ memberId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'blood_pressure',
    value: '',
    unit: '',
    notes: '',
    timestamp: new Date().toISOString().slice(0, 16) // Format for datetime-local input
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const metricTypes = [
    { value: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', placeholder: '120/80' },
    { value: 'weight', label: 'Weight', unit: 'kg', placeholder: '70.5' },
    { value: 'height', label: 'Height', unit: 'cm', placeholder: '175' },
    { value: 'heart_rate', label: 'Heart Rate', unit: 'bpm', placeholder: '72' },
    { value: 'temperature', label: 'Temperature', unit: '°C', placeholder: '37.0' },
    { value: 'blood_glucose', label: 'Blood Glucose', unit: 'mg/dL', placeholder: '100' },
    { value: 'oxygen_saturation', label: 'Oxygen Saturation', unit: '%', placeholder: '98' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-update unit when type changes
    if (name === 'type') {
      const selectedType = metricTypes.find(type => type.value === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        unit: selectedType?.unit || '',
        value: '' // Clear value when type changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.type) newErrors.type = 'Metric type is required';
    if (!formData.value.trim()) newErrors.value = 'Value is required';
    if (!formData.timestamp) newErrors.timestamp = 'Timestamp is required';
    if (!memberId || memberId === 'default-member-id' || memberId === 'demo-member-id') {
      newErrors.memberId = 'Valid member ID is required - Please create a member first';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const metricData = {
        ...formData,
        memberId: memberId,
        timestamp: new Date(formData.timestamp).toISOString()
      };
      
      console.log('📤 Sending health metric data to backend (port 3000):', metricData);
      const result = await apiService.createHealthMetric(metricData);
      console.log('✅ Health metric created successfully:', result);
      
      if (result.success) {
        alert('Health metric saved successfully! ✅');
        onSave(result.data);
        
        // Reset form for next entry but don't auto-update unit to prevent confusion
        const selectedTypeUnit = metricTypes.find(type => type.value === 'blood_pressure')?.unit || '';
        setFormData({
          type: 'blood_pressure',
          value: '',
          unit: selectedTypeUnit,
          notes: '',
          timestamp: new Date().toISOString().slice(0, 16)
        });
      } else {
        console.error('❌ Save failed:', result);
        alert('Failed to save health metric. Please try again.');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('An error occurred while saving. Please try again.');
    }
    setIsLoading(false);
  };

  const selectedType = metricTypes.find(type => type.value === formData.type);

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Add Health Metric</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="metric-type" style={{ display: 'block', marginBottom: '5px' }}>
            Metric Type *
          </label>
          <select
            id="metric-type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.type ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
          >
            {metricTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && <span style={{ color: 'red', fontSize: '12px' }}>{errors.type}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="metric-value" style={{ display: 'block', marginBottom: '5px' }}>
            Value * {selectedType && `(${selectedType.unit})`}
          </label>
          <input
            type="text"
            id="metric-value"
            name="value"
            value={formData.value}
            onChange={handleInputChange}
            placeholder={selectedType?.placeholder || 'Enter value'}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.value ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
          />
          {errors.value && <span style={{ color: 'red', fontSize: '12px' }}>{errors.value}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="metric-unit" style={{ display: 'block', marginBottom: '5px' }}>
            Unit
          </label>
          <input
            type="text"
            id="metric-unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            readOnly={!!selectedType}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="metric-timestamp" style={{ display: 'block', marginBottom: '5px' }}>
            Date & Time *
          </label>
          <input
            type="datetime-local"
            id="metric-timestamp"
            name="timestamp"
            value={formData.timestamp}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.timestamp ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
          />
          {errors.timestamp && <span style={{ color: 'red', fontSize: '12px' }}>{errors.timestamp}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="metric-notes" style={{ display: 'block', marginBottom: '5px' }}>
            Notes
          </label>
          <textarea
            id="metric-notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Additional notes about this measurement..."
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Saving...' : 'Add Metric'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthMetricForm;
