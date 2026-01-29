import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft, UserPlus, LogIn, Building, Clock, Mail, Lock, MapPin, Tag, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const BusinessLogin = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register form
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [placeName, setPlaceName] = useState('');
    const [placeType, setPlaceType] = useState('Clinic');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: loginEmail,
                password: loginPassword
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('place', JSON.stringify(res.data.place));
            navigate('/business/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                email: regEmail,
                password: regPassword,
                businessName,
                placeName,
                placeType,
                address,
                city
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            localStorage.setItem('place', JSON.stringify(res.data.place));
            navigate('/business/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const placeTypes = [
        { value: 'Clinic', label: 'Clinic / Hospital' },
        { value: 'Hospital', label: 'Hospital' },
        { value: 'Restaurant', label: 'Restaurant / Cafe' },
        { value: 'Government Office', label: 'Government Office' },
        { value: 'Service Center', label: 'Service Center / Bank' },
        { value: 'Other', label: 'Other' }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div className="ml-4 flex items-center">
                                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                                <span className="ml-2 font-bold text-gray-900 dark:text-white tracking-tight">WaitClarity</span>
                                <span className="mx-2 text-gray-200 dark:text-gray-700">/</span>
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Business</span>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
                {/* Left Panel - Info */}
                <div className="hidden lg:flex lg:w-1/2 bg-gray-900 dark:bg-black p-16 flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20">
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600 rounded-full blur-[120px]" />
                    </div>

                    <div className="max-w-md relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-5xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                                Help customers know when to visit
                            </h2>
                            <p className="text-gray-400 text-xl mb-12 leading-relaxed font-medium">
                                Register your business to share real-time wait times.
                                Reduce frustration and improve customer loyalty.
                            </p>

                            <div className="space-y-6">
                                {[
                                    'Update wait times in seconds',
                                    'Reduce customer complaints',
                                    'Build trust with transparency',
                                    'Free to use for all businesses'
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (idx * 0.1) }}
                                        className="flex items-center text-gray-300 font-bold"
                                    >
                                        <div className="h-2 w-8 bg-blue-500 rounded-full mr-4 shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
                                        {item}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24">
                    <div className="w-full max-w-lg">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isRegister ? 'register' : 'login'}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div className="text-center mb-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6 shadow-xl shadow-blue-500/10">
                                        {isRegister ? <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" /> : <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
                                    </div>
                                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                        {isRegister ? 'Register Your Business' : 'Business Login'}
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium">
                                        {isRegister
                                            ? 'Create an account to manage your wait times'
                                            : 'Sign in to update your real-time data'
                                        }
                                    </p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-6 py-4 rounded-2xl mb-8 text-sm font-bold flex items-center"
                                    >
                                        <AlertCircle className="h-5 w-5 mr-3 shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                {!isRegister ? (
                                    /* Login Form */
                                    <form onSubmit={handleLogin} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                                                Email Address
                                            </label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                                    value={loginEmail}
                                                    onChange={e => setLoginEmail(e.target.value)}
                                                    placeholder="you@business.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                                                Password
                                            </label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="password"
                                                    required
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                                    value={loginPassword}
                                                    onChange={e => setLoginPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center disabled:opacity-50 shadow-xl shadow-blue-500/20 active:scale-95"
                                        >
                                            {loading ? (
                                                <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <LogIn className="h-5 w-5 mr-2" />
                                                    Sign In to Dashboard
                                                </>
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    /* Register Form */
                                    <form onSubmit={handleRegister} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="col-span-1 sm:col-span-2 space-y-2">
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">
                                                    Business Name
                                                </label>
                                                <div className="relative group">
                                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                                        value={businessName}
                                                        onChange={e => setBusinessName(e.target.value)}
                                                        placeholder="Your Business Name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                                    value={regEmail}
                                                    onChange={e => setRegEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                                                <input
                                                    type="password"
                                                    required
                                                    minLength={6}
                                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                                    value={regPassword}
                                                    onChange={e => setRegPassword(e.target.value)}
                                                    placeholder="Min 6 characters"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 space-y-6">
                                            <div className="flex items-center">
                                                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
                                                <span className="px-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Location Details</span>
                                                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Place Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                                    value={placeName}
                                                    onChange={e => setPlaceName(e.target.value)}
                                                    placeholder="e.g., City General Hospital"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Category</label>
                                                <div className="relative group">
                                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                    <select
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white appearance-none focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                                        value={placeType}
                                                        onChange={e => setPlaceType(e.target.value)}
                                                    >
                                                        {placeTypes.map(t => (
                                                            <option key={t.value} value={t.value}>{t.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Address</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                                        value={address}
                                                        onChange={e => setAddress(e.target.value)}
                                                        placeholder="123 Main Street"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">City</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                                        value={city}
                                                        onChange={e => setCity(e.target.value)}
                                                        placeholder="Mumbai"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center disabled:opacity-50 shadow-xl shadow-blue-500/20 active:scale-95"
                                        >
                                            {loading ? (
                                                <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <UserPlus className="h-5 w-5 mr-3" />
                                                    Create Business Account
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-10 text-center">
                            <button
                                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors uppercase tracking-widest"
                            >
                                {isRegister ? 'Already registered? Sign In' : "New business? Create account"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessLogin;
