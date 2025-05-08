import { useState } from 'react';
import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AdminBaseUrl } from '../routes/base-url';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Custom CSS/customToast.css'

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${AdminBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      toast.success("Logged in successfully!", {
        className: 'customToast',  // Apply custom class for styling
        position: "bottom-center", // Position the toast nicely
        autoClose: 5000, // Auto close after 5 seconds
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error(error.message, {
        className: 'customToast', // Apply custom class for styling
        position: "bottom-center", // Position the toast
        autoClose: 5000, // Auto close after 5 seconds
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                <span className="text-purple-300">Har</span>
                <span className="text-yellow-300">Fun</span>
                <span className="text-pink-300">Mola</span>
              </h1>
              <p className="text-white/80">Admin Dashboard</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-lg font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3 pr-3 py-8 h-10 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="admin@harfunmola.com"
                  />

                </div>
              </div>

              <div className="mb-8">
                <label htmlFor="password" className="block text-lg font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-8 h-10 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-purple-300 hover:text-purple-200 cursor-pointer" />
                    ) : (
                      <FaEye className="h-5 w-5 text-purple-300 hover:text-purple-200 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/30 rounded bg-white/10"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-purple-300 hover:text-purple-200">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </form>
          </div>
          <div className="px-8 py-4 bg-black/20 text-center">
            <p className="text-xs text-white/60">
              © 2023 HarFunMola Admin Dashboard. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-center"  // Position the toast at the bottom center
        autoClose={5000}          // Auto close after 5 seconds
        hideProgressBar={false}   // Keep the progress bar visible
        newestOnTop={false}       // To show toasts in order
        rtl={false}               // Set to false if you don't need RTL
        pauseOnFocusLoss={false}  // Disable pause on focus loss
        draggable={true}          // Allow toasts to be draggable
        pauseOnHover={true}       // Pause when hovering over the toast
        toastStyle={{
          background: 'linear-gradient(45deg, #6a11cb, #2575fc)',  // Gradient background
          color: '#fff',
          borderRadius: '12px',  // Rounded corners
          fontSize: '20px',      // Larger text size
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',  // Soft shadow
          padding: '20px 30px',  // Increase padding
          fontFamily: "'Roboto', sans-serif",  // Elegant font
        }}
        progressStyle={{
          backgroundColor: '#fff', // White progress bar
        }}
      />

    </div>
  );
};

export default AdminLogin;