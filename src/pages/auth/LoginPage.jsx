import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import PageHeader from '../../components/layout/PageHeader';
import FormField from '../../components/ui/FormField';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import LinkText from '../../components/layout/LinkText';
import SocialButtons from '../../components/ui/SocialButtons';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      const success = onLogin(formData);
      if (success) {
        navigate('/');
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <AuthLayout imageUrl="/public/login-cover.png">
      <Helmet>
        <title>Login - Coffee Shop</title>
        <meta name="description" content="Login to your coffee shop account to order and track your purchases" />
      </Helmet>

      <PageHeader title="Login" subtitle="Fill out the form correctly" />
      <div className="space-y-4">
        <FormField label="Email" error={errors.email}>
          <InputField 
            icon={Mail} 
            type="email" 
            name="email" 
            placeholder="Enter Your Email" 
            value={formData.email} 
            onChange={handleChange} 
          />
        </FormField>
        <FormField label="Password" error={errors.password}>
          <InputField 
            icon={Lock} 
            type="password" 
            name="password" 
            placeholder="Enter Your Password" 
            value={formData.password} 
            onChange={handleChange} 
          />
        </FormField>
        <div className="text-right -mt-1">
          <button 
            onClick={() => navigate('/forgot-password')} 
            className="text-orange-500 hover:text-orange-600 text-sm"
          >
            Lupa Password?
          </button>
        </div>
        <div className="pt-2">
          <Button onClick={handleSubmit} variant="primary">Login</Button>
        </div>
      </div>
      <LinkText 
        text="Not Have An Account?" 
        linkText="Register" 
        onClick={() => navigate('/register')} 
      />
      <SocialButtons />
    </AuthLayout>
  );
};

export default LoginPage;