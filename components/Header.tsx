'use client'

import {  Calendar1Icon, HomeIcon, ListCheckIcon, LogInIcon,  UserIcon, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import ToggleDarkMode from './ToggleDarkMode'
import LogoutBtn from './LogoutBtn';
import UserAvatar from './UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import MenuButton from './MenuButton'
import BellNotif from './BellNotif'
import Link from 'next/link'

function Header() {

    const { user } = useAuth();
    const router = useRouter();
   
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

                  <BellNotif />
                </div>
            </header>

            <div className={`fixed top-0 right-0 transition-transform duration-500 ease-in-out transform ${openMenu ? "translate-x-0" : "translate-x-full "
                } h-screen w-full md:w-1/2 lg:w-1/3 mid-lightbg mid-darkbg z-40`}>
                <div className=' mt-[70px]'>



                    <nav className="flex flex-col items-start justify-center space-y-8 p-5 flex-grow ">

                        <ToggleDarkMode />
                        <LogoutBtn />
                       
                        
                        <Link href="/dashboard" onClick={() => setOpenMenu(false)} className="dark:text-white text-gray-800 hover:text-maroon-300 cursor-pointer flex flex-row justify-center items-center space-x-3 text-xl font-semibold transition ease-out"><HomeIcon /><span>Home</span></Link>
                        <Link href="/dashboard/messages" onClick={() => setOpenMenu(false)} className="dark:text-white text-gray-800 hover:text-maroon-300 cursor-pointer flex flex-row justify-center items-center space-x-3 text-xl font-semibold transition ease-out"><MessageCircle /><span>Messages</span></Link>
                        <Link href="/dashboard/sessions" onClick={() => setOpenMenu(false)} className="dark:text-white text-gray-800 hover:text-maroon-300 cursor-pointer flex flex-row justify-center items-center space-x-3 text-xl font-semibold transition ease-out"><ListCheckIcon /><span>Sessions</span></Link>
                        <Link href="/dashboard/profile" onClick={() => setOpenMenu(false)} className="dark:text-white text-gray-800 hover:text-maroon-300 cursor-pointer flex flex-row justify-center items-center space-x-3 text-xl font-semibold transition ease-out"><UserIcon /><span>Profile</span></Link>
                        <span className="dark:text-white text-gray-800 hover:text-maroon-300 cursor-pointer flex flex-row justify-center items-center space-x-3 text-xl font-semibold transition ease-out"><BellNotif /> <Link href="/dashboard/notifications" onClick={() => setOpenMenu(false)} >Notifications </Link></span>
                        <Link href="/dashboard/timetable" onClick={() => setOpenMenu(false)} className="dark:text-white text-gray-800 hover:text-maroon-300 cursor-pointer flex flex-row justify-center items-center space-x-3 text-xl font-semibold transition ease-out"><Calendar1Icon /><span>Schedule</span></Link>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Header