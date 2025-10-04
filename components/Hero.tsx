'use client'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Timeline from './Timeline'

import { motion, useScroll, useTransform } from 'framer-motion'

function Hero() {
    const { user } = useAuth();
    const [scrollY, setScrollY] = useState(0);
    const { scrollYProgress } = useScroll();
    
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const timelineOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
    const timelineY = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className=' dark:from-gray-900 dark:to-gray-800'>
            {/* Navigation */}
            <nav className='fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
                <div className='flex justify-between items-center p-4 max-w-6xl mx-auto'>
                  <p className='font-bold'>SKILLSWAP</p>
                    <Link href={user ? '/dashboard' : '/sign-in'} 
                          className='text-gray-900 dark:text-white hover:text-indigo-600'>
                        {user ? "Dashboard" : "Login"}
                    </Link>
                </div>
            </nav>

           
            <motion.section 
                style={{ opacity: heroOpacity }}
                className='min-h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden'
            >
           
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div 
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-indigo-200 to-purple-300 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full blur-2xl opacity-60"
                    ></motion.div>
                    <motion.div 
                        animate={{ rotate: -360, y: [0, -20, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-yellow-200 to-pink-300 dark:from-yellow-900/30 dark:to-pink-900/30 rounded-full blur-3xl opacity-50"
                    ></motion.div>
                    
              
                    <motion.div 
                        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-32 left-16 w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg transform rotate-12"
                    ></motion.div>
                    <motion.div 
                        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-64 right-24 w-6 h-6 bg-gradient-to-br from-pink-400 to-red-500 rounded-full"
                    ></motion.div>
                    <motion.div 
                        animate={{ y: [0, -20, 0], x: [0, 5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-48 left-24 w-4 h-12 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full transform -rotate-12"
                    ></motion.div>
                </div>

                <div className='max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10'>
                    {/* Content with creative layout */}
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className='text-center md:text-left relative'
                    >
                        {/* Creative text highlight */}
                        <div className="absolute -top-4 -left-4 w-24 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform -rotate-2"></div>
                        
                        <h1 className='text-4xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white relative'>
                            Find your next 
                            <span className="relative inline-block mx-2">
                                <span className="relative z-10 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">micro-mentor</span>
                                <motion.div 
                                    animate={{ scaleX: [0, 1] }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="absolute bottom-2 left-0 w-full h-3 bg-yellow-300 dark:bg-yellow-500 opacity-30 rounded-sm origin-left"
                                ></motion.div>
                            </span>
                            in minutes
                        </h1>
                        
                        <p className='text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed'>
                            Connect with skilled professionals for quick 15-minute knowledge exchanges. 
                            Learn new skills while sharing your expertise.
                        </p>
                        
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href='/sign-up' 
                                  className='inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 relative overflow-hidden group'>
                                <span className="relative z-10">Get Started Free</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Creative image section */}
                    <motion.div 
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className='flex flex-1 justify-center items-center h-full relative'
                    >
                        {/* Chaotic floating skill cards */}
                        <motion.div 
                            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-8 -left-12 w-20 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-xl border-2 border-white dark:border-gray-700 flex items-center justify-center transform -rotate-12 z-20"
                        >
                            <span className="text-white font-bold text-sm">React</span>
                        </motion.div>
                        
                        <motion.div 
                            animate={{ y: [0, 20, 0], rotate: [0, -8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -top-4 -right-16 w-24 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl shadow-xl border-2 border-white dark:border-gray-700 flex items-center justify-center transform rotate-12 z-20"
                        >
                            <span className="text-white font-bold text-xs">Business</span>
                        </motion.div>
                        
                        <motion.div 
                            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute -bottom-6 -left-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full shadow-xl border-3 border-white dark:border-gray-700 flex items-center justify-center transform rotate-45 z-20"
                        >
                            <span className="text-white font-bold text-xs transform -rotate-45">UI/UX</span>
                        </motion.div>
                        
                        <motion.div 
                            animate={{ y: [0, 25, 0], rotate: [0, 15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                            className="absolute -bottom-2 -right-12 w-18 h-14 bg-gradient-to-br from-orange-500 to-red-400 rounded-2xl shadow-xl border-2 border-white dark:border-gray-700 flex items-center justify-center transform -rotate-6 z-20 px-2"
                        >
                            <span className="text-white font-bold text-xs">Marketing</span>
                        </motion.div>

                        {/* Main image with creative effects */}
                        <div className="relative transform hover:scale-105 transition-transform duration-500">
                            <motion.div 
                                animate={{ rotate: [0, 2, -2, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 scale-110"
                            ></motion.div>
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white dark:border-gray-700 transform rotate-2">
                                <img 
                                    src="/images/skill-swap-hero.jpg" 
                                    alt="Team collaboration and skill sharing"
                                    className="w-full h-auto max-w-lg object-cover hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Timeline Section */}
            <motion.section 
                style={{ opacity: timelineOpacity, y: timelineY }}
                className='min-h-screen flex items-center justify-center px-4 py-20 bg-white dark:bg-gray-900'
            >
                <div className='max-w-4xl mx-auto'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                            How SkillSwap Works
                        </h2>
                        <p className='text-xl text-gray-600 dark:text-gray-400'>
                            Get started in 5 simple steps and begin exchanging skills today
                        </p>
                    </div>
                    <Timeline />
                </div>
            </motion.section>
        </div>
    )
}

export default Hero