import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import {
    Stethoscope,
    Utensils,
    Building2,
    Landmark,
    Wrench,
    ChevronRight,
    Clock,
    Users,
    TrendingUp,
    ArrowRight
} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const categories = [
        {
            id: 'Clinic',
            name: 'Healthcare',
            subtitle: 'Clinics & Hospitals',
            icon: Stethoscope,
            color: '#0f4c75',
            bgColor: '#e0f2fe'
        },
        {
            id: 'Restaurant',
            name: 'Dining',
            subtitle: 'Restaurants & Cafes',
            icon: Utensils,
            color: '#c2410c',
            bgColor: '#ffedd5'
        },
        {
            id: 'Government Office',
            name: 'Government',
            subtitle: 'Public Offices',
            icon: Building2,
            color: '#475569',
            bgColor: '#f1f5f9'
        },
        {
            id: 'Service Center',
            name: 'Services',
            subtitle: 'Banks & Centers',
            icon: Landmark,
            color: '#7c3aed',
            bgColor: '#ede9fe'
        },
        {
            id: 'Other',
            name: 'Other',
            subtitle: 'More Places',
            icon: Wrench,
            color: '#6b7280',
            bgColor: '#f3f4f6'
        },
    ];

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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <header className="border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 transition-colors">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center"
                        >
                            <Clock className="h-7 w-7 text-blue-600 dark:text-blue-500" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white tracking-tight">WaitClarity</span>
                        </motion.div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => navigate('/business')}
                                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Business Login
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-900/10 dark:to-gray-900 -z-10" />
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight"
                    >
                        Know the wait time
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mt-2">
                            before you go
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mt-8 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Real-time waiting information powered by community reports and business updates.
                        Make informed decisions about when to visit.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
                    >
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <Clock className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Live</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Real-time Updates</p>
                        </div>
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <Users className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Crowd-sourced</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Community Reports</p>
                        </div>
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-7 w-7 text-sky-600 dark:text-sky-400" />
                            </div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">Smart</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">AI Insights</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20 lg:py-28">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
                        >
                            Select a Category
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 text-gray-600 dark:text-gray-400"
                        >
                            Choose the type of place you're planning to visit
                        </motion.p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
                    >
                        {categories.map((cat) => {
                            const IconComponent = cat.icon;
                            return (
                                <motion.button
                                    key={cat.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                                    onClick={() => navigate(`/places?type=${cat.id}`)}
                                    className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 text-left hover:border-blue-100 dark:hover:border-blue-900 transition-all duration-300 shadow-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <div
                                            className="p-4 rounded-2xl transition-colors"
                                            style={{ backgroundColor: cat.bgColor }}
                                        >
                                            <IconComponent
                                                className="h-7 w-7"
                                                style={{ color: cat.color }}
                                            />
                                        </div>
                                        <ChevronRight className="h-6 w-6 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mt-2" />
                                    </div>
                                    <h3 className="mt-8 text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-tight">{cat.name}</h3>
                                    <p className="mt-2 text-gray-500 dark:text-gray-400 font-medium">{cat.subtitle}</p>
                                </motion.button>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Business CTA */}
            <section className="py-24 bg-gray-900 dark:bg-black relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
                </div>
                <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-bold text-white tracking-tight">
                                Own a business?
                            </h3>
                            <p className="mt-4 text-gray-400 text-lg max-w-md">
                                Help customers know your wait times in real-time. Boost trust and transparency with a free profile.
                            </p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/business')}
                            className="inline-flex items-center px-8 py-4 bg-white dark:bg-blue-600 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-500 transition-colors shadow-xl"
                        >
                            Register Your Business
                            <ArrowRight className="ml-3 h-5 w-5" />
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 dark:border-gray-800 transition-colors">
                <div className="max-w-6xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center text-gray-900 dark:text-white font-bold">
                            <Clock className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-500 transition-colors" />
                            <span>WaitClarity</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">
                            Know the wait time before you go.
                        </p>
                        <div className="flex gap-6 text-sm text-gray-400 uppercase tracking-widest font-bold">
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Product Hunt</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
