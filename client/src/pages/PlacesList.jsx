import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Clock, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import axios from 'axios';

const PlacesList = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type');
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchPlaces();
    }, [type]);

    const fetchPlaces = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/places`, { params: { type } });
            setPlaces(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPlaces = places.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCrowdStyles = (level) => {
        switch (level) {
            case 'Low': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
            case 'Medium': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400';
            case 'High': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div className="ml-3">
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white">{type}</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{filteredPlaces.length} locations found</p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {/* Search */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, address, or city..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                                <div className="h-4 bg-gray-100 dark:bg-gray-700/50 rounded w-1/2 mb-6"></div>
                                <div className="flex gap-3">
                                    <div className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded-xl w-24"></div>
                                    <div className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded-xl w-28"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredPlaces.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredPlaces.map(place => (
                                <motion.button
                                    layout
                                    variants={itemVariants}
                                    key={place._id}
                                    onClick={() => navigate(`/place/${place._id}`)}
                                    className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 text-left hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden shadow-sm"
                                >
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {place.name}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 flex items-center mt-1.5 font-medium">
                                                <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                                                {place.address}, {place.city}
                                            </p>

                                            <div className="flex items-center gap-3 mt-5">
                                                <div className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    <span className="text-sm font-bold">{place.currentWaitTime} min</span>
                                                </div>
                                                <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getCrowdStyles(place.crowdLevel)}`}>
                                                    {place.crowdLevel} <span className="hidden sm:inline">Crowd</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700/50 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                            <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
                            <AlertCircle className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No locations found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs mx-auto">
                            {searchTerm
                                ? `We couldn't find any results for "${searchTerm}"`
                                : 'No businesses have registered in this category yet.'
                            }
                        </p>
                        <button
                            onClick={() => navigate('/business')}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                        >
                            Register your business
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PlacesList;
