import React, { useState } from 'react';
import { apiService } from '../../services/api';

interface ConversationFormProps {
  memberId: string;
  onSave: (conversation: any) => void;
  onCancel: () => void;
}

const ConversationForm: React.FC<ConversationFormProps> = ({ memberId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'general',
    initialMessage: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.initialMessage.trim()) newErrors.initialMessage = 'Initial message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const conversationData = {
        memberId,
        subject: formData.subject,
        priority: formData.priority,
        category: formData.category,
        status: 'active' as const, // Use 'as const' to ensure correct type
        metadata: {
          category: formData.category,
          priority: formData.priority
        }
      };
      
      const result = await apiService.createConversation(conversationData);
      console.log('✅ Conversation created:', result);
      
      if (result.success && formData.initialMessage.trim()) {
        // Add initial message
        const messageData = {
          content: formData.initialMessage,
          senderRole: 'care_coordinator' as const,
          senderName: 'Care Team',
          timestamp: new Date().toISOString()
        };
        
        await apiService.sendMessage(result.data.id, messageData);
        console.log('✅ Initial message sent');
      }
      
      if (result.success) {
        onSave(result.data);
      } else {
        console.error('❌ Save failed:', result);
        alert('Failed to create conversation. Please try again.');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      alert('An error occurred while creating conversation. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Start New Conversation</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="conversation-subject" style={{ display: 'block', marginBottom: '5px' }}>
            Subject *
          </label>
          <input
            type="text"
            id="conversation-subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="e.g., Blood Pressure Questions, Medication Side Effects"
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.subject ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
            autoComplete="off"
          />
          {errors.subject && <span style={{ color: 'red', fontSize: '12px' }}>{errors.subject}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="conversation-priority" style={{ display: 'block', marginBottom: '5px' }}>
            Priority
          </label>
          <select
            id="conversation-priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="conversation-category" style={{ display: 'block', marginBottom: '5px' }}>
            Category
          </label>
          <select
            id="conversation-category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="general">General Question</option>
            <option value="medication">Medication</option>
            <option value="symptoms">Symptoms</option>
            <option value="appointment">Appointment</option>
            <option value="test_results">Test Results</option>
            <option value="emergency">Emergency</option>
            <option value="followup">Follow-up</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="conversation-message" style={{ display: 'block', marginBottom: '5px' }}>
            Initial Message *
          </label>
          <textarea
            id="conversation-message"
            name="initialMessage"
            value={formData.initialMessage}
            onChange={handleInputChange}
            rows={5}
            placeholder="Type your message here..."
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errors.initialMessage ? 'red' : '#ddd'}`,
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
          {errors.initialMessage && <span style={{ color: 'red', fontSize: '12px' }}>{errors.initialMessage}</span>}
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
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isLoading ? 'Creating...' : 'Start Conversation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversationForm;
