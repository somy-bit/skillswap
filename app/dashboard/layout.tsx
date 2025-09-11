// app/dashboard/layout.tsx
'use client'

import Header from "@/components/Header";
import { DARK, DARK_BG, LIGHT_BG } from "@/lib/utils";
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [notif, setNotif] = useState<string[]>()
  
    return (
        <>
            <div className={` mt-[60px]`}>
                <Header notif={notif} />
                {/* Main content */}
                <main className={`flex-1 min-h-screen  ${DARK_BG} dark:bg-[${DARK}] `}>{children}</main>
            </div>
        </>
    )
}
