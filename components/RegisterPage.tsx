import React, { useState } from 'react';
import { LogoIcon } from './icons/Icons';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // --- Simulation Logic ---
    // In a real app, this would be an API call to a backend server.
    // Here we'll use localStorage to store users.
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      setError('An account with this email already exists.');
      return;
    }

    users[email] = { password, name };
    localStorage.setItem('users', JSON.stringify(users));

    setSuccess('Account created successfully! Redirecting to login...');
    setTimeout(() => {
        onRegisterSuccess();
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center">
            <LogoIcon className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-white">Create a new account</h2>
            <p className="text-gray-400">
                or{' '}
                <button onClick={onNavigateToLogin} className="font-medium text-emerald-500 hover:text-emerald-400">
                    sign in to your existing account
                </button>
            </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-200 bg-red-900/50 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-emerald-200 bg-emerald-900/50 rounded-lg">
              {success}
            </div>
          )}
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <div className="mt-1">
              <input
                id="full-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email-register" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email-register"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password-register" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password-register"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!!success}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;