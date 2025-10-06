import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import PageHeader from '../../components/layout/PageHeader';
import FormField from '../../components/ui/FormField';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';

const ForgotPasswordPage = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }
    const success = onForgotPassword(email);
    if (success) {
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <AuthLayout imageUrl="/public/forgot-cover.png">
      <PageHeader 
        title="Fill out the form correctly" 
        subtitle="We will send new password to your email" 
      />
      <div className="space-y-4">
        <FormField label="Email" error={error}>
          <InputField 
            icon={Mail} 
            type="email" 
            name="email" 
            placeholder="Enter Your Email" 
            value={email} 
            onChange={handleChange} 
          />
        </FormField>
        <div className="pt-2">
          <Button onClick={handleSubmit} variant="primary">Submit</Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;