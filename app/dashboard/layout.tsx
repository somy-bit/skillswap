
'use client'

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { DARK, DARK_BG} from "@/lib/utils";
import { usePathname } from "next/navigation";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isMessagePage = pathname?.includes('/messages');

    return (
        <>
            <div className={` mt-[60px]`}>
                <Header  />
              
                <main className={`flex-1 min-h-screen  ${DARK_BG} dark:bg-[${DARK}] `}>{children}</main>
                {!isMessagePage && <Footer />}
            </div>
        </>
    )
}
