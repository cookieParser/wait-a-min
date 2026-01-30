import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Clock,
    MapPin,
    TrendingUp,
    Users,
    AlertCircle,
    Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import axios from 'axios';
import { socket } from '../lib/socket';
import { formatDistanceToNow } from 'date-fns';

const PlaceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on('connect', onConnect);
        socket.on('connect_error', onDisconnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('connect_error', onDisconnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    useEffect(() => {
        fetchDetails();

        // Join room for this specific place
        socket.emit('joinPlace', id);

        socket.on('waitTimeUpdated', (data) => {
            console.log('Real-time update received:', data);
            if (data.placeId === id) {
                setPlace(prev => prev ? { ...prev, ...data } : prev);
            }
        });

        const onConnect = () => {
            setIsConnected(true);
            socket.emit('joinPlace', id); // Re-join on reconnect
        };
        const onDisconnect = () => setIsConnected(false);

        socket.on('connect', onConnect);
        socket.on('connect_error', onDisconnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('waitTimeUpdated');
            socket.off('connect', onConnect);
            socket.off('connect_error', onDisconnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await axios.get(`${API_URL}/places/${id}`);
            setPlace(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getCrowdStyles = (level) => {
        switch (level) {
            case 'Low': return { bg: 'bg-green-50 dark:bg-green-900/10', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-900/30' };
            case 'Medium': return { bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-900/30' };
            case 'High': return { bg: 'bg-red-50 dark:bg-red-900/10', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-900/30' };
            default: return { bg: 'bg-gray-50 dark:bg-gray-800/50', text: 'text-gray-700 dark:text-gray-400', border: 'border-gray-200 dark:border-gray-700' };
        }
    };

    const getConfidenceStyles = (level) => {
        switch (level) {
            case 'High': return { text: 'text-green-600 dark:text-green-400', label: 'High confidence' };
            case 'Medium': return { text: 'text-amber-600 dark:text-amber-400', label: 'Moderate confidence' };
            default: return { text: 'text-gray-500 dark:text-gray-500', label: 'Limited data' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">Loading details...</p>
                </div>
            </div>
        );
    }

    if (!place) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="text-center">
                    <AlertCircle className="h-14 w-14 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Location not found</h2>
                    <button onClick={() => navigate('/')} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                        Go back home
                    </button>
                </div>
            </div>
        );
    }

    const crowdStyle = getCrowdStyles(place.crowdLevel);
    const confidenceStyle = getConfidenceStyles(place.confidenceLevel);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <span className="ml-3 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest hidden sm:inline">Back</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                                    {isConnected ? 'Live' : 'Offline'}
                                </span>
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {/* Place Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8 shadow-sm"
                >
                    <div className="p-8 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-lg mb-4 uppercase tracking-wider">
                                    {place.type}
                                </span>
                                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">{place.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400 flex items-center font-medium">
                                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                                    {place.address}, {place.city}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Wait Time Display */}
                    <div className="p-8 bg-gray-50/50 dark:bg-gray-900/20">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                            >
                                <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{place.currentWaitTime}</p>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest">minutes wait</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -4 }}
                                className={`rounded-2xl p-6 border transition-colors ${crowdStyle.bg} ${crowdStyle.border} shadow-sm`}
                            >
                                <div className={`flex items-center justify-center mb-3 ${crowdStyle.text}`}>
                                    <Users className="h-6 w-6" />
                                </div>
                                <p className={`text-2xl font-extrabold ${crowdStyle.text}`}>{place.crowdLevel}</p>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest">crowd level</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -4 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm"
                            >
                                <div className="flex items-center justify-center text-gray-400 dark:text-gray-600 mb-3">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <p className={`text-sm font-extrabold ${confidenceStyle.text} uppercase tracking-tight`}>
                                    {place.confidenceLevel}
                                </p>
                                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest">data quality</p>
                            </motion.div>
                        </div>

                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 text-center mt-6">
                            Last updated {place.lastUpdated ? formatDistanceToNow(new Date(place.lastUpdated), { addSuffix: true }) : 'recently'}
                        </p>
                    </div>
                </motion.div>

                {/* Insights */}
                {place.insights && place.insights.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-10"
                    >
                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-3 text-blue-500" />
                            Smart Insights
                        </h3>
                        <div className="space-y-3">
                            {place.insights.map((insight, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-start shadow-sm"
                                >
                                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 mr-4">
                                        <Info className="h-5 w-5 text-blue-500 shrink-0" />
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{insight}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PlaceDetails;
