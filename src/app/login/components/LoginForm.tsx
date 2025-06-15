// src/pages/Index/components/LoginForm.tsx
import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  // This prop allows LoginForm to update the global authentication state
  // managed in `App.tsx` (via `LoginPage`).
  setIsLoggedIn: (value: boolean) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Controls the "Log in" button loading state
  const [redirecting, setRedirecting] = useState(false); // Controls the full-screen "Logging you in..." message
  const [error, setError] = useState<string | null>(null); // For displaying API errors
  const navigate = useNavigate();

  // Password strength criteria for validation feedback
  const passwordCriteria = [
    { text: 'Use 8 or more characters', met: password.length >= 8 },
    { text: 'One Uppercase character', met: /[A-Z]/.test(password) },
    { text: 'One lowercase character', met: /[a-z]/.test(password) },
    { text: 'One special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { text: 'One number', met: /\d/.test(password) },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Activate loading state on the button
    setError(null); // Clear any previous error messages

    try {
      // Make the API call to your backend authentication endpoint
      const response = await fetch('https://tda-backend-khaki.vercel.app/api/auth/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Parse the JSON response

      if (!response.ok) {
        // If the HTTP response status is not OK (e.g., 400, 401, 500), throw an error
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login successful:', data);
      setRedirecting(true); // Show the full-screen "Logging you in..." message
      setIsLoggedIn(true); // 🎉 Crucial: Update the global authentication state in App.tsx!

      // Introduce a small delay before navigating to allow the "Logging you in..." screen to be seen.
      // After setIsLoggedIn(true), the ProtectedElement in App.tsx will automatically
      // attempt to render the protected route, triggering navigation. The setTimeout ensures
      // the loading screen is visible for at least a brief moment.
      setTimeout(() => {
        navigate('/dashboard'); // Navigate to the dashboard after successful login
      }, 10); // 10ms delay is minimal, adjust as needed for visual effect

    } catch (err: any) {
      // Catch any errors during the fetch operation or from the API response
      setError(err.message || 'Something went wrong');
      setRedirecting(false); // If login fails, ensure the redirecting screen is not shown
    } finally {
      setLoading(false); // Deactivate loading state on the button, regardless of success or failure
    }
  };

  // Conditional rendering for the "Logging you in..." screen
  if (redirecting) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white px-8 py-6 rounded-2xl shadow-xl text-center flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-6 w-6 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-gray-700 text-base font-medium">Logging you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mt-20">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome to <span className="text-red-400">TDA</span> HR System
        </h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            required
            disabled={loading} // Disable input while loading
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              tabIndex={-1} // Prevents button from being focused by tab key, improving accessibility for password input
              disabled={loading} // Disable button while loading
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            required
            disabled={loading} // Disable input while loading
          />
        </div>

        {password && ( // Only show password criteria if password input has a value
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-500 mt-3">
            {passwordCriteria.map((criterion, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    criterion.met ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
                <span className={criterion.met ? 'text-green-600' : 'text-gray-500'}>
                  {criterion.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading} // Disable button while loading
          className={`w-full bg-red-400 hover:bg-red-500 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 mt-8 ${
            loading ? 'opacity-70 cursor-not-allowed' : '' // Apply dimming and no-cursor style when loading
          }`}
        >
          {loading ? 'Logging in...' : 'Log in'} {/* Button text changes based on loading state */}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;