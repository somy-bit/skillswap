'use client'

import React, { useState } from 'react'
import { LogOut } from 'lucide-react'
import { handleSignout } from '@/lib/signOut'
import { useRouter } from 'next/navigation'



const LogoutBtn: React.FC = () => {

  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await handleSignout()
      router.replace('/sign-in')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <>
      {/* Custom Button */}
      <button
        onClick={() => setOpen(true)}
        className={`dark:text-white flex flex-row items-center space-x-3 text-gray-800 hover:text-maroon-300 cursor-pointer text-xl font-semibold transition ease-out`}
      >
        <LogOut className='w-4 h-4' />
        <span>Logout</span>

      </button>

      {/* Confirmation Dialog */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-black  text-gray-900 dark:text-white rounded-lg p-6 w-80 flex flex-col space-y-4">
            <h2 className="text-lg font-semibold  text-gray-900 dark:text-white">Confirm Logout</h2>
            <p className="text-sm text-gray-900 dark:text-white opacity-80">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded-lg border dark:bg-gray-700 dark:text-white border-gray-300  hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LogoutBtn