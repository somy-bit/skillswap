'use client'

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from '@/contexts/AuthContext';





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
   <AuthProvider>
      <html lang="en">
        <body
          className="w-full "
        >
         
          {children}
           <ToastContainer position="top-right" autoClose={1000} />
        </body>
      </html>
    </AuthProvider>

  );
}
