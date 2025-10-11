import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock } from 'lucide-react';
import AuthLayout from '../../components/layout/AuthLayout';
import PageHeader from '../../components/layout/PageHeader';
import FormField from '../../components/ui/FormField';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import LinkText from '../../components/layout/LinkText';
import SocialButtons from '../../components/ui/SocialButtons';
import Notification from '../../components/ui/Notification';
import { register } from '../../redux/authActions';
import { clearError } from '../../redux/authSlice';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

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
    if (error) dispatch(clearError());
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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
      const result = await dispatch(register(formData));
      
      if (result.success) {
        setNotification({ 
          message: 'Registration successful! Please login.', 
          type: 'success' 
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setNotification({ message: result.error, type: 'error' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <AuthLayout imageUrl="/public/register-cover.png">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <PageHeader title="Register" subtitle="Fill out the form correctly" />
      <div className="space-y-4">
        <FormField label="Full Name" error={errors.fullName}>
          <InputField
            icon={User}
            type="text"
            name="fullName"
            placeholder="Enter Your Full Name"
            value={formData.fullName}
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
  );
};

export default RegisterPage;