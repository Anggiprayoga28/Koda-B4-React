import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import PageHeader from '../../components/layout/PageHeader';
import FormField from '../../components/ui/FormField';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import LinkText from '../../components/layout/LinkText';
import SocialButtons from '../../components/ui/SocialButtons';
import Notification from '../../components/ui/Notification';

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Register - Coffee Shop';
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
      try {
        const requestBody = {
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone: formData.phone,
        };

        console.log('Register Request:', requestBody);

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log('Register Response:', data);

        if (data.success) {
          setNotification({ 
            message: data.message || 'Registration successful!', 
            type: 'success' 
          });
          
          setTimeout(() => {
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
          }, 1500);
        } else {
          setNotification({ 
            message: data.message || 'Registration failed. Please try again.', 
            type: 'error' 
          });
        }
      } catch (error) {
        console.error('Registration error:', error);
        setNotification({ 
          message: 'Network error. Please check your connection.', 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      {/* Desktop/Tablet View */}
      <div className="hidden md:block">
        <AuthLayout imageUrl="/register-cover.png">
          {notification && (
            <Notification message={notification.message} type={notification.type} />
          )}

          <PageHeader title="Register" subtitle="Fill out the form correctly" />
          <div className="space-y-4">
            <FormField label="Full Name" error={errors.full_name}>
              <InputField
                icon={User}
                type="text"
                name="full_name"
                placeholder="Enter Your Full Name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </FormField>
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
            <FormField label="Phone Number" error={errors.phone}>
              <InputField
                icon={Phone}
                type="tel"
                name="phone"
                placeholder="Enter Your Phone Number"
                value={formData.phone}
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
            <FormField label="Confirm Password" error={errors.confirmPassword}>
              <InputField
                icon={Lock}
                type="password"
                name="confirmPassword"
                placeholder="Enter Your Password Again"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </FormField>
            <div className="pt-2">
              <Button 
                onClick={handleSubmit} 
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Register'}
              </Button>
            </div>
          </div>
          <LinkText
            text="Have An Account?"
            linkText="Login"
            onClick={() => navigate('/login')}
          />
          <SocialButtons />
        </AuthLayout>
      </div>

      {/* Mobile View */}
      <div className="md:hidden min-h-screen bg-white flex flex-col">
        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}
        
        <div className="flex-1 flex flex-col p-6">
          <div className="flex items-center gap-2 mb-6">
            <img src="/logo-coklat.svg" alt="Coffee Shop" className="h-10" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Register</h1>
            <p className="text-gray-500 text-sm">Fill out the form correctly</p>
          </div>

          <div className="space-y-4 flex-1">
            <FormField label="Full Name" error={errors.full_name}>
              <InputField
                icon={User}
                type="text"
                name="full_name"
                placeholder="Enter Your Full Name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </FormField>
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
            <FormField label="Phone Number" error={errors.phone}>
              <InputField
                icon={Phone}
                type="tel"
                name="phone"
                placeholder="Enter Your Phone Number"
                value={formData.phone}
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
            <FormField label="Confirm Password" error={errors.confirmPassword}>
              <InputField
                icon={Lock}
                type="password"
                name="confirmPassword"
                placeholder="Enter Your Password Again"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </FormField>
          </div>

          <div className="space-y-3 mt-4">
            <Button 
              onClick={handleSubmit} 
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Register'}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">Have An Account? </span>
              <button
                onClick={() => navigate('/login')}
                className="text-#8E6447 hover:text-#7A5538 font-medium"
              >
                Login
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <SocialButtons />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;