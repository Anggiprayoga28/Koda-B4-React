import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    document.title = 'Forgot Password - Coffee Shop';
  }, []);

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
    <>
      <div className="hidden md:block">
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
      </div>

      <div className="md:hidden min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex flex-col p-6">
          <div className="flex items-center gap-2 mb-6">
            <img src="/public/logo-coklat.svg" alt="Coffee Shop" className="h-10" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Fill Out The Form Correctly</h1>
            <p className="text-gray-500 text-sm">We will send new password to your email</p>
          </div>

          <div className="space-y-4 flex-1">
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
          </div>

          <div className="mt-4">
            <Button onClick={handleSubmit} variant="primary">Submit</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;