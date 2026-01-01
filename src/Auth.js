import React, { useState } from 'react';

const Auth = ({ onAuthSuccess }) => {
    const [isSignup, setIsSignup] = useState(true);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Use different endpoints for signup vs login
            const endpoint = isSignup
                ? 'https://sdk-calendar-be.onrender.com/api/auth/signup'
                : 'https://sdk-calendar-be.onrender.com/api/auth/login';

            // Prepare payload based on mode
            const payload = isSignup
                ? formData // All fields for signup
                : { phoneNumber: formData.phoneNumber, password: formData.password }; // Only phone & password for login

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                // Store token in localStorage
                localStorage.setItem('calendar_auth_token', data.data.token);
                localStorage.setItem('calendar_user', JSON.stringify(data.data.user));

                // Call success callback
                onAuthSuccess(data.data.token);
            } else {
                setError(data.message || 'Authentication failed');
            }
        } catch (err) {
            setError('Network error. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0c0600] overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FF9933]/10 blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FFD700]/8 blur-[120px] animate-pulse-delayed"></div>
            </div>

            {/* Auth Form Container */}
            <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-1000">
                {/* Glassmorphic Card */}
                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-[#FFD700] mb-2 tracking-wide">
                            {isSignup ? 'Welcome' : 'Welcome Back'}
                        </h2>
                        <p className="text-white/60 text-sm">
                            {isSignup ? 'Create your account to continue' : 'Sign in to access your calendar'}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Phone Number - Show for both signup and login */}
                        {(isSignup || !isSignup) && (
                            <div>
                                <label className="block text-white/70 text-sm mb-2 font-medium">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/10 transition-all"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        )}

                        {/* Email - Only show for signup */}
                        {isSignup && (
                            <div>
                                <label className="block text-white/70 text-sm mb-2 font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required={isSignup}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/10 transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-white/70 text-sm mb-2 font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/10 transition-all"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-[#FF9933] to-[#FFD700] text-[#0c0600] font-bold rounded-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    {/* Toggle Login/Signup */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                                setFormData({ phoneNumber: '', email: '', password: '' });
                            }}
                            className="text-[#FFD700]/70 hover:text-[#FFD700] text-sm transition-colors"
                        >
                            {isSignup ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                        </button>
                    </div>
                </div>

                {/* Decorative Line */}
                <div className="mt-6 h-[1px] w-full bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent"></div>
            </div>

            {/* Animations */}
            <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        @keyframes pulse-delayed {
          0%, 100% { opacity: 0.2; transform: scale(1.1); }
          50% { opacity: 0.1; transform: scale(1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-delayed {
          animation: pulse-delayed 10s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default Auth;
