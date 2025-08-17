import React, { useState } from 'react';
import { apiService } from '../../services/api';

interface MemberFormProps {
  member?: any;
  onSave: (member: any) => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    dateOfBirth: member?.dateOfBirth?.split('T')[0] || '',
    gender: member?.gender || 'male',
    address: member?.address || '',
    emergencyContact: member?.emergencyContact || '',
    insuranceInfo: member?.insuranceInfo || '',
    communicationPreference: member?.communicationPreference || 'email', // Required field
    // Handle arrays properly
    currentConditions: Array.isArray(member?.currentConditions) ? member.currentConditions : [],
    medications: Array.isArray(member?.medications) ? member.medications : [],
    allergies: Array.isArray(member?.allergies) ? member.allergies : [],
    healthGoals: Array.isArray(member?.healthGoals) ? member.healthGoals : [],
    // Handle numbers properly
    planAdherence: member?.planAdherence || 75,
    engagementLevel: member?.engagementLevel || 'medium',
    // Set default dates
    lastActive: member?.lastActive || new Date().toISOString(),
    joinDate: member?.joinDate || new Date().toISOString(),
    profileImage: member?.profileImage || null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle number inputs
    if (name === 'planAdherence') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
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

  const handleArrayInputChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.communicationPreference) newErrors.communicationPreference = 'Communication preference is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Prepare data for backend - ensure proper data types and required fields
      const memberData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        dateOfBirth: formData.dateOfBirth, // Keep as string, backend will handle conversion
        gender: formData.gender,
        address: formData.address.trim() || null,
        emergencyContact: formData.emergencyContact.trim() || null,
        insuranceInfo: formData.insuranceInfo.trim() || null,
        communicationPreference: formData.communicationPreference, // Required field
        currentConditions: formData.currentConditions,
        medications: formData.medications,
        allergies: formData.allergies,
        healthGoals: formData.healthGoals,
        planAdherence: Number(formData.planAdherence),
        engagementLevel: formData.engagementLevel,
        lastActive: new Date().toISOString(),
        joinDate: formData.joinDate || new Date().toISOString(),
        profileImage: formData.profileImage
      };
      
      console.log('📤 Sending member data to backend:', memberData);
      
      let result;
      if (member?.id) {
        // Update existing member
        result = await apiService.updateMember(member.id, memberData);
        console.log('✅ Member updated:', result);
      } else {
        // Create new member
        result = await apiService.createMember(memberData);
        console.log('✅ Member created:', result);
      }
      
      if (result.success) {
        alert(`Member ${member?.id ? 'updated' : 'created'} successfully! ✅`);
        onSave(result.data);
      } else {
        console.error('❌ Save failed:', result);
        alert('Failed to save member. Please check console for details.');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('An error occurred while saving. Please check the console for details.');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>{member?.id ? 'Edit Member' : 'Add New Member'}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Basic Information</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-name" style={{ display: 'block', marginBottom: '5px' }}>
              Name *
            </label>
            <input
              type="text"
              id="member-name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.name ? 'red' : '#ddd'}`,
                borderRadius: '4px'
              }}
              autoComplete="name"
            />
            {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-email" style={{ display: 'block', marginBottom: '5px' }}>
              Email *
            </label>
            <input
              type="email"
              id="member-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.email ? 'red' : '#ddd'}`,
                borderRadius: '4px'
              }}
              autoComplete="email"
            />
            {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-phone" style={{ display: 'block', marginBottom: '5px' }}>
              Phone
            </label>
            <input
              type="tel"
              id="member-phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              autoComplete="tel"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-dob" style={{ display: 'block', marginBottom: '5px' }}>
              Date of Birth *
            </label>
            <input
              type="date"
              id="member-dob"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.dateOfBirth ? 'red' : '#ddd'}`,
                borderRadius: '4px'
              }}
              autoComplete="bday"
            />
            {errors.dateOfBirth && <span style={{ color: 'red', fontSize: '12px' }}>{errors.dateOfBirth}</span>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-gender" style={{ display: 'block', marginBottom: '5px' }}>
              Gender
            </label>
            <select
              id="member-gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-communication" style={{ display: 'block', marginBottom: '5px' }}>
              Communication Preference *
            </label>
            <select
              id="member-communication"
              name="communicationPreference"
              value={formData.communicationPreference}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.communicationPreference ? 'red' : '#ddd'}`,
                borderRadius: '4px'
              }}
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="phone">Phone</option>
              <option value="app">Mobile App</option>
            </select>
            {errors.communicationPreference && <span style={{ color: 'red', fontSize: '12px' }}>{errors.communicationPreference}</span>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-adherence" style={{ display: 'block', marginBottom: '5px' }}>
              Plan Adherence (%)
            </label>
            <input
              type="number"
              id="member-adherence"
              name="planAdherence"
              value={formData.planAdherence}
              onChange={handleInputChange}
              min="0"
              max="100"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-engagement" style={{ display: 'block', marginBottom: '5px' }}>
              Engagement Level
            </label>
            <select
              id="member-engagement"
              name="engagementLevel"
              value={formData.engagementLevel}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="very_low">Very Low</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very_high">Very High</option>
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Contact Information</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-address" style={{ display: 'block', marginBottom: '5px' }}>
              Address
            </label>
            <textarea
              id="member-address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              autoComplete="street-address"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-emergency" style={{ display: 'block', marginBottom: '5px' }}>
              Emergency Contact
            </label>
            <input
              type="text"
              id="member-emergency"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Name: Phone"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-insurance" style={{ display: 'block', marginBottom: '5px' }}>
              Insurance Information
            </label>
            <input
              type="text"
              id="member-insurance"
              name="insuranceInfo"
              value={formData.insuranceInfo}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Provider and Policy Number"
            />
          </div>
        </div>

        {/* Health Information */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Health Information (Optional)</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-conditions" style={{ display: 'block', marginBottom: '5px' }}>
              Current Conditions (comma-separated)
            </label>
            <input
              type="text"
              id="member-conditions"
              name="currentConditions"
              value={formData.currentConditions.join(', ')}
              onChange={(e) => handleArrayInputChange('currentConditions', e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="e.g., Hypertension, Diabetes"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-medications" style={{ display: 'block', marginBottom: '5px' }}>
              Medications (comma-separated)
            </label>
            <input
              type="text"
              id="member-medications"
              name="medications"
              value={formData.medications.join(', ')}
              onChange={(e) => handleArrayInputChange('medications', e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="e.g., Lisinopril 10mg, Metformin 500mg"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="member-allergies" style={{ display: 'block', marginBottom: '5px' }}>
              Allergies (comma-separated)
            </label>
            <input
              type="text"
              id="member-allergies"
              name="allergies"
              value={formData.allergies.join(', ')}
              onChange={(e) => handleArrayInputChange('allergies', e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="e.g., Penicillin, Shellfish"
            />
          </div>
        </div>

        {/* Form Actions */}
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
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Saving...' : (member?.id ? 'Update Member' : 'Create Member')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
