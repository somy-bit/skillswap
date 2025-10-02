'use client'

import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { set } from 'date-fns'

import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { BellIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

function BellNotif() {

  const { user } = useAuth()

  const [notif, setNotif] = React.useState<Array<{ id: string;[key: string]: any }>>([])

  useEffect(() => {
    if (!user) return;
    const ref = doc(db, "notifications", user.uid);
    const unsubscribe = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        setNotif(docSnap.data().notifications || []);
      }
    });
   
    return () => unsubscribe();

  }, [user])
  return (
    <Link href="/dashboard/notifications" className="relative inline-block ml-4">
      <BellIcon className={`h-6 w-6 text-gray-900 dark:text-white`} />
      {notif && notif.length > 0 && (
        <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
          {notif.length}
        </span>
      )}
    </Link>
  )
}

export default BellNotif