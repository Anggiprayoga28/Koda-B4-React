import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { clearAuthError, login } from '../../redux/slices/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user, isLoading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    document.title = 'Login - Coffee Shop';
    
    if (location.state?.message) {
      setNotification({ 
        message: location.state.message, 
        type: 'success' 
      });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (error) {
      setNotification({ message: error, type: 'error' });
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
      try {
        const resultAction = await dispatch(login({
          email: formData.email,
          password: formData.password
        }));
        
        if (login.fulfilled.match(resultAction)) {
          const result = resultAction.payload;
          
          setNotification({ message: 'Login successful!', type: 'success' });
          
          setTimeout(() => {
            if (result.user?.role === 'admin') {
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          }, 500);
        }
        
      } catch (err) {
        console.error('Login error:', err);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <AuthLayout imageUrl="/login-cover.png">
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
                className="text-#8E6447 hover:text-#7A5538 text-sm"
              >
                Lupa Password?
              </button>
            </div>
            <div className="pt-2">
              <Button 
                onClick={handleSubmit} 
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Login'}
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
      </div>

      <div className="md:hidden bg-white flex flex-col">
        {notification && (
          <Notification message={notification.message} type={notification.type} />
        )}
        
        <div className="flex-1 flex flex-col p-6">
          <div className="flex items-center gap-2 mb-6">
            <img src="/logo-coklat.svg" alt="Coffee Shop" className="h-10" />
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Login</h1>
            <p className="text-gray-500 text-sm">Fill out the form correctly</p>
          </div>

          <div className="space-y-4 flex-1">
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
            <div className="text-right">
              <button
                onClick={() => navigate('/forgot-password')}
                className="text-#8E6447 hover:text-#7A5538 text-sm font-medium"
              >
                Lupa Password?
              </button>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <Button 
              onClick={handleSubmit} 
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-600">Not Have An Account? </span>
              <button
                onClick={() => navigate('/register')}
                className="text-#8E6447 hover:text-#7A5538 font-medium"
              >
                Register
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
            </div>

            <SocialButtons /> 
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;