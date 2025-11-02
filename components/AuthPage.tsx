import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService';

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<string | null>;
  onSignUp: (name: string, email: string, password: string) => Promise<string | null>;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignUp }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [hasUsers, setHasUsers] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const checkUsers = async () => {
        const users = await api.getUsers();
        setHasUsers(users.length > 0);
        if (users.length === 0) {
            setIsSigningUp(true);
        }
    };
    checkUsers();
  }, []);
  
  const switchTab = (signingUp: boolean) => {
    setIsSigningUp(signingUp);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    const errorMsg = await onSignUp(name, email, password);
    if (errorMsg) {
      setError(errorMsg);
    }
    setIsLoading(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const errorMsg = await onLogin(email, password);
    if (errorMsg) {
      setError(errorMsg);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
        <h1 className="text-4xl font-bold text-center text-teal-400 mb-2">Welcome to EventFlow</h1>
        <p className="text-center text-gray-400 mb-8">Your personal event planning assistant.</p>
        
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => switchTab(false)}
                className={`flex-1 py-2 text-center font-semibold ${!isSigningUp ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400'}`}
              >
                Log In
              </button>
              <button
                onClick={() => switchTab(true)}
                className={`flex-1 py-2 text-center font-semibold ${isSigningUp ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400'}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {isSigningUp ? (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-200">Create Your Account</h2>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
                />
              </div>
              <div>
                <label htmlFor="email-signup" className="block text-sm font-medium text-gray-400">Email Address</label>
                <input
                  type="email"
                  id="email-signup"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
                />
              </div>
              <div>
                <label htmlFor="password-signup" className="block text-sm font-medium text-gray-400">Password</label>
                <input
                  type="password"
                  id="password-signup"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors shadow disabled:bg-teal-800"
              >
                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Sign Up & Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-200">Log In to Your Account</h2>
                {!hasUsers ? (
                    <div className="text-center text-gray-400 p-4 border border-dashed border-gray-600 rounded-lg">
                        <p>No accounts found.</p>
                        <p>Please <button type="button" onClick={() => switchTab(true)} className="text-teal-400 hover:underline font-semibold">sign up</button> to continue.</p>
                    </div>
                ) : (
                    <>
                        <div>
                            <label htmlFor="email-login" className="block text-sm font-medium text-gray-400">Email Address</label>
                            <input
                            type="email"
                            id="email-login"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-login" className="block text-sm font-medium text-gray-400">Password</label>
                            <input
                            type="password"
                            id="password-login"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 text-white"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors shadow disabled:bg-teal-800"
                        >
                            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Log In'}
                        </button>
                    </>
                )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};