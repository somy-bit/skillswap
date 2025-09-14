'use client'

import { BellIcon, Calendar1Icon, HomeIcon, ListCheckIcon, LogInIcon, MenuIcon, UserIcon } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import ToggleDarkMode from './ToggleDarkMode'
import LogoutBtn from './LogoutBtn';
import UserAvatar from './UserAvatar';

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext';
import MenuButton from './MenuButton'

function Header({ notif }: { notif?: string[] }) {

    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <>
            <header className={`flex fixed top-0 z-50 w-full h-[60px] mid-lightbg mid-darkbg shadow-sm p-3 items-center justify-between`}>
               
               
                <div className='textlight textdark'>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <UserAvatar />

                        </div>
                    ) : (
                        <button
                            onClick={() => router.push('/sign-in')}
                            className={`textlight text-dark text-xl flex cursor-pointer flex-row items-center space-x-3 font-semibold transition ease-out`}
                        >
                            <LogInIcon className='w-4 h-4' />
                            <span>Login</span>
                        </button>
                    )}
                </div>

                <div className='flex flex-row items-center'>
                    <MenuButton isOpen={openMenu} onToggle={() => setOpenMenu(!openMenu)} />

                    <Link href="/dashboard/notifications" className="relative inline-block ml-4">
                        <BellIcon className={`h-6 w-6 text-gray-900 dark:text-white`} />
                        {notif && notif.length > 0 && (
                            <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                {notif.length}
                            </span>
                        )}
                    </Link>
                </div>
            </header>

            <div className={`fixed top-0 right-0 transition-transform duration-500 ease-in-out transform ${openMenu ? "translate-x-0" : "translate-x-full "
                } h-screen w-full md:w-1/2 lg:w-1/3 mid-lightbg mid-darkbg z-40`}>
                <div className=' mt-[70px]'>



                    <nav className="flex flex-col items-start justify-center space-y-8 p-5 flex-grow ">

                        <ToggleDarkMode />
                        <LogoutBtn />
                        <button onClick={() => { router.replace('/dashboard'); setOpenMenu(false); }} className="dark:text-white text-gray-800 hover:text-maroon-300 cursor-pointer flex flex-row justify-center items-center space-x-3 text-xl font-semibold transition ease-out"><HomeIcon /><span>Home</span></button>
                        <button onClick={() => { router.replace('/dashboard/sessions'); setOpenMenu(false) }} className="dark:text-white text-gray-800 hover:text-maroon-300 flex flex-row items-center justify-center  space-x-3 cursor-pointer text-xl font-semibold transition ease-out"><ListCheckIcon /><span>Sessions</span></button>
                        <button onClick={() => { router.replace(`/dashboard/profile`); setOpenMenu(false) }} className="dark:text-white text-gray-800 hover:text-maroon-300 flex flex-row items-center space-x-3 justify-center  cursor-pointer text-xl font-semibold transition ease-out"><UserIcon /><span>Profile</span></button>
                        <button onClick={() => { router.replace('/dashboard/notifications'); setOpenMenu(false) }} className="dark:text-white text-gray-800 hover:text-maroon-300 flex flex-row items-center space-x-3 cursor-pointer justify-center  text-xl font-semibold transition ease-out"><BellIcon /><span>Notifications {notif?.length}</span></button>
                        <button onClick={() => { router.replace('/dashboard/timetable'); setOpenMenu(false); }} className="dark:text-white text-gray-800 hover:text-maroon-300 flex flex-row items-center space-x-3 cursor-pointer text-xl font-semibold justify-center  transition ease-out"><Calendar1Icon /><span>Schedule</span></button>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Header