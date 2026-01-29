import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    Clock,
    Users,
    TrendingUp,
    Save,
    RefreshCw,
    MapPin,
    CheckCircle,
    Building,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const BusinessDashboard = () => {
    const [place, setPlace] = useState(null);
    const [user, setUser] = useState(null);
    const [waitTime, setWaitTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/business');
            return;
        }

        const savedUser = localStorage.getItem('user');
        const savedPlace = localStorage.getItem('place');

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedPlace) {
            const p = JSON.parse(savedPlace);
            fetchPlaceDetails(p.id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchPlaceDetails = async (placeId) => {
        try {
            const res = await axios.get(`${API_URL}/places/${placeId}`);
            setPlace(res.data);
            setWaitTime(res.data.currentWaitTime || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setSaving(true);
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${API_URL}/places/${place._id}/official`,
                { waitTime: Number(waitTime) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess('Wait time updated successfully');
            fetchPlaceDetails(place._id);
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('place');
        navigate('/business');
    };

    const quickTimes = [0, 10, 15, 20, 30, 45, 60, 90];

    const getCrowdColor = (level) => {
        switch (level) {
            case 'Low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30';
            case 'Medium': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30';
            case 'High': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-10 w-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                            <span className="ml-2 font-bold text-gray-900 dark:text-white tracking-tight">WaitClarity</span>
                            <span className="mx-2 text-gray-200 dark:text-gray-700">/</span>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Dashboard</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <div className="h-6 w-px bg-gray-100 dark:bg-gray-800 mx-2"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors uppercase tracking-tight"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Welcome */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                        Welcome back, <span className="text-blue-600 dark:text-blue-500">{user?.businessName || 'Business'}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your location data and update wait times in real-time.</p>
                </motion.div>

                {place ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Place Info & Stats */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Place Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                        <Building className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <button
                                        onClick={() => fetchPlaceDetails(place._id)}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                </div>
                                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 leading-tight">{place.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-6 font-medium">
                                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                    {place.address}, {place.city}
                                </p>
                                <span className="inline-flex px-4 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full uppercase tracking-widest border border-gray-100 dark:border-gray-700">
                                    {place.type}
                                </span>
                            </motion.div>

                            {/* Current Stats */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm"
                            >
                                <h4 className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-8 flex items-center">
                                    <TrendingUp className="h-4 w-4 mr-3 text-blue-500" />
                                    Live Performance
                                </h4>
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-600 dark:text-gray-300 font-bold">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg mr-4">
                                                <Clock className="h-4 w-4 text-blue-500" />
                                            </div>
                                            Wait Time
                                        </div>
                                        <span className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">
                                            {place.currentWaitTime}<span className="text-sm font-bold text-gray-400 dark:text-gray-500 ml-1">min</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-600 dark:text-gray-300 font-bold">
                                            <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg mr-4">
                                                <Users className="h-4 w-4 text-amber-500" />
                                            </div>
                                            Crowd Level
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getCrowdColor(place.crowdLevel)}`}>
                                            {place.crowdLevel}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-600 dark:text-gray-300 font-bold">
                                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg mr-4">
                                                <CheckCircle className="h-4 w-4 text-indigo-500" />
                                            </div>
                                            Reliability
                                        </div>
                                        <span className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
                                            {place.confidenceLevel}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Update Form */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 sm:p-12 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                                            Broadcast Update
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                                            Inform customers of current wait times instantly.
                                        </p>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex items-center bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 px-6 py-4 rounded-2xl mb-8 border border-green-100 dark:border-green-900/30 text-sm font-bold"
                                        >
                                            <CheckCircle className="h-5 w-5 mr-3 shrink-0" />
                                            {success}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Time Input Container */}
                                <div className="bg-gray-50 dark:bg-gray-950/50 rounded-3xl p-8 mb-10 border border-gray-100 dark:border-gray-800">
                                    <label className="block text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
                                        Current Wait Time (minutes)
                                    </label>
                                    <div className="flex flex-col sm:flex-row items-center gap-8">
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                min="0"
                                                max="300"
                                                className="w-40 px-6 py-6 text-5xl font-black text-center text-blue-600 dark:text-blue-500 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none shadow-sm dark:shadow-none tabular-nums"
                                                value={waitTime}
                                                onChange={e => setWaitTime(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center sm:items-start">
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white">minutes</span>
                                            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 font-medium">Set 0 for "No wait"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Select Grid */}
                                <div className="mb-12">
                                    <label className="block text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 ml-1">
                                        Quick Presets
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {quickTimes.map((time) => (
                                            <motion.button
                                                key={time}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setWaitTime(time)}
                                                className={`py-4 rounded-2xl text-sm font-bold border transition-all shadow-sm ${Number(waitTime) === time
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                                                    }`}
                                            >
                                                {time === 0 ? 'No wait' : `${time} min`}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl transition-all flex items-center justify-center disabled:opacity-50 shadow-xl shadow-blue-500/20 active:scale-[0.98] group"
                                >
                                    {saving ? (
                                        <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                                            Broadcast Update
                                        </>
                                    )}
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-3 py-4 border-t border-gray-100 dark:border-gray-800">
                                    <RefreshCw className="h-4 w-4 text-gray-400 animate-spin-slow" />
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        Changes sync instantly to WaitClarity users
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-16 text-center shadow-sm"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full mb-8">
                            <Building className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">No location linked</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8 font-medium">
                            Your business account isn't associated with a physical location yet. Contact support to set this up.
                        </p>
                        <button
                            onClick={() => navigate('/business')}
                            className="inline-flex items-center px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-2xl hover:opacity-90 transition-opacity uppercase tracking-widest text-xs"
                        >
                            Contact Support
                            <ArrowRight className="h-4 w-4 ml-3" />
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BusinessDashboard;
