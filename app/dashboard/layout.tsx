

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { DARK, DARK_BG} from "@/lib/utils";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
   


  
    return (
        <>
            <div className={` mt-[60px]`}>
                <Header  />
              
                <main className={`flex-1 min-h-screen  ${DARK_BG} dark:bg-[${DARK}] `}>{children}</main>
                <Footer />
            </div>
        </>
    )
}
