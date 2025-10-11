import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import PageHeader from '../../components/layout/PageHeader';
import FormField from '../../components/ui/FormField';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import LinkText from '../../components/layout/LinkText';
import SocialButtons from '../../components/ui/SocialButtons';
import Notification from '../../components/ui/Notification';
import { login } from '../../redux/authActions';
import { clearError } from '../../redux/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    document.title = 'Login - Coffee Shop';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
    if (error) dispatch(clearError());
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      const result = await dispatch(login(formData));
      
      if (result.success) {
        setNotification({ message: 'Login successful!', type: 'success' });
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setNotification({ message: result.error, type: 'error' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <AuthLayout imageUrl="/public/login-cover.png">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

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
          <Button 
            onClick={handleSubmit} 
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </Button>
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