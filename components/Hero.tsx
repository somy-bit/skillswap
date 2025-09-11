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
        <div className='bg-gradient-to-br from-indigo-200 to-white dark:from-gray-900 dark:to-gray-800'>
            {/* Navigation */}
            <nav className='fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
                <div className='flex justify-between items-center p-4 max-w-6xl mx-auto'>
                  
                    <Link href={user ? '/dashboard' : '/sign-in'} 
                          className='text-gray-900 dark:text-white hover:text-indigo-600'>
                        {user ? "Dashboard" : "Login"}
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <motion.section 
                style={{ opacity: heroOpacity }}
                className='min-h-screen flex items-center justify-center px-4 pt-20'
            >
                <div className='max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center'>
                    {/* Content */}
                    <div className='text-center md:text-left'>
                        <h1 className='text-4xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white'>
                            Find your next micro-mentor in minutes
                        </h1>
                        <p className='text-xl text-gray-700 dark:text-gray-300 mb-6'>
                            Connect with skilled professionals for quick 15-minute knowledge exchanges. 
                            Learn new skills while sharing your expertise.
                        </p>
                        <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
                            Whether you're looking to master a new programming language, improve your design skills, 
                            or learn business strategies, SkillSwap connects you with the right mentors instantly. 
                            Our platform makes professional development accessible, efficient, and mutually beneficial.
                        </p>
                        <Link href='/sign-up' 
                              className='inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold'>
                            Get Started Free
                        </Link>
                    </div>

                    {/* SVG Illustration */}
                    <div className='flex justify-center'>
                        <svg width="400" height="300" viewBox="0 0 400 300" className="w-full max-w-md">
                            {/* Background circles */}
                            <circle cx="200" cy="150" r="120" fill="#e0e7ff" opacity="0.3"/>
                            <circle cx="200" cy="150" r="80" fill="#c7d2fe" opacity="0.5"/>
                            
                            {/* People icons */}
                            <g transform="translate(150, 100)">
                                <circle cx="0" cy="0" r="25" fill="#4f46e5"/>
                                <circle cx="0" cy="-15" r="8" fill="white"/>
                                <rect x="-12" y="5" width="24" height="20" rx="12" fill="white"/>
                            </g>
                            
                            <g transform="translate(250, 100)">
                                <circle cx="0" cy="0" r="25" fill="#7c3aed"/>
                                <circle cx="0" cy="-15" r="8" fill="white"/>
                                <rect x="-12" y="5" width="24" height="20" rx="12" fill="white"/>
                            </g>
                            
                            <g transform="translate(150, 200)">
                                <circle cx="0" cy="0" r="25" fill="#059669"/>
                                <circle cx="0" cy="-15" r="8" fill="white"/>
                                <rect x="-12" y="5" width="24" height="20" rx="12" fill="white"/>
                            </g>
                            
                            <g transform="translate(250, 200)">
                                <circle cx="0" cy="0" r="25" fill="#dc2626"/>
                                <circle cx="0" cy="-15" r="8" fill="white"/>
                                <rect x="-12" y="5" width="24" height="20" rx="12" fill="white"/>
                            </g>
                            
                            {/* Connection lines */}
                            <line x1="175" y1="100" x2="225" y2="100" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5"/>
                            <line x1="175" y1="200" x2="225" y2="200" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5"/>
                            <line x1="150" y1="125" x2="150" y2="175" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5"/>
                            <line x1="250" y1="125" x2="250" y2="175" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5"/>
                            
                            {/* Skills badges */}
                            <rect x="100" y="50" width="60" height="20" rx="10" fill="#fbbf24"/>
                            <text x="130" y="63" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Design</text>
                            
                            <rect x="240" y="50" width="60" height="20" rx="10" fill="#10b981"/>
                            <text x="270" y="63" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Code</text>
                            
                            <rect x="100" y="230" width="60" height="20" rx="10" fill="#8b5cf6"/>
                            <text x="130" y="243" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Marketing</text>
                            
                            <rect x="240" y="230" width="60" height="20" rx="10" fill="#f59e0b"/>
                            <text x="270" y="243" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Business</text>
                        </svg>
                    </div>
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