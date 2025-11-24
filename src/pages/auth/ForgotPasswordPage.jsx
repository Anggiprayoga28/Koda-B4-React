import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import axios from 'axios';

import AuthLayout from '../../components/layout/AuthLayout';
import PageHeader from '../../components/layout/PageHeader';
import FormField from '../../components/ui/FormField';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Forgot Password - Coffee Shop';
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);

      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        formData
      );

      if (response.data.success) {
        setStep(2);
        setNotification({
          type: 'success',
          message: 'OTP has been sent to your email. Please check your inbox.',
        });

        if (response.data.data?.otp) {
          console.log('='.repeat(50));
          console.log('OTP CODE:', response.data.data.otp);
          console.log('='.repeat(50));
          alert(
            `Development Mode - OTP Code: ${response.data.data.otp}\n\nNote: In production, this will be sent via email only.`
          );
        }
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('OTP code is required');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('otp', otp);
      formData.append('new_password', newPassword);
      formData.append('confirm_password', confirmPassword);

      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-otp`,
        formData
      );

      if (response.data.success) {
        setNotification({
          type: 'success',
          message: 'Password reset successful! Redirecting to login...',
        });

        setTimeout(() => {
          navigate('/login', {
            state: {
              message: 'Password reset successfully. Please login with your new password.',
            },
          });
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const renderDesktop = () => (
    <div className="hidden md:block">
      <AuthLayout imageUrl="/forgot-cover.png">
        {notification && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {notification.message}
          </div>
        )}

        {step === 1 ? (
          <>
            <PageHeader
              title="Fill out the form correctly"
              subtitle="We will send OTP to your email to reset your password"
            />
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <FormField label="Email" error={error}>
                <InputField
                  icon={Mail}
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                />
              </FormField>

              <div className="pt-2 space-y-3">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Submit'}
                </Button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <PageHeader
              title="Reset Your Password"
              subtitle={`Enter the OTP and your new password (sent to ${email})`}
            />

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <FormField label="OTP Code">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      setOtp(value);
                      if (error) setError('');
                    }
                  }}
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-[0.4em] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  OTP expires in 5 minutes.
                </p>
              </FormField>

              <FormField label="New Password">
                <InputField
                  icon={Lock}
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError('');
                  }}
                />
              </FormField>

              <FormField label="Confirm Password" error={error}>
                <InputField
                  icon={Lock}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                />
              </FormField>

              {error && !error.includes('Passwords do not match') && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="flex items-center gap-2 text-orange-500 hover:text-orange-600"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change Email
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleEmailSubmit}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </AuthLayout>
    </div>
  );

  const renderMobile = () => (
    <div className="md:hidden min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo-coklat.svg" alt="Coffee Shop" className="h-10" />
        </div>

        {notification && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {notification.message}
          </div>
        )}

        {step === 1 ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Fill Out The Form Correctly
              </h1>
              <p className="text-gray-500 text-sm">
                We will send OTP to your email
              </p>
            </div>

            <form
              onSubmit={handleEmailSubmit}
              className="space-y-4 flex-1 flex flex-col"
            >
              <FormField label="Email" error={error}>
                <InputField
                  icon={Mail}
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                />
              </FormField>

              <div className="mt-auto space-y-3">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Submit'}
                </Button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full text-center text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Reset Password
              </h1>
              <p className="text-gray-500 text-sm">
                Enter OTP and your new password
              </p>
              <p className="text-xs text-gray-400 mt-1">Sent to: {email}</p>
            </div>

            <form
              onSubmit={handlePasswordReset}
              className="space-y-4 flex-1 flex flex-col"
            >
              <FormField label="OTP Code">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 6) {
                      setOtp(value);
                      if (error) setError('');
                    }
                  }}
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center tracking-[0.4em] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </FormField>

              <FormField label="New Password">
                <InputField
                  icon={Lock}
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError('');
                  }}
                />
              </FormField>

              <FormField label="Confirm Password" error={error}>
                <InputField
                  icon={Lock}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                />
              </FormField>

              <div className="mt-auto space-y-3">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>

                <div className="flex justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    ← Change Email
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleEmailSubmit}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {renderDesktop()}
      {renderMobile()}
    </>
  );
};

export default ForgotPasswordPage;
