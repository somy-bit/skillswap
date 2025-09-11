import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { db } from "@/lib/firebase";
import { doc, getDoc, where } from "firebase/firestore";
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const DARK_BG='bg-[#1A0000]'
export const LIGHT_BG='bg-[#FBEAEA]'
export const DARK='#1A0000'
export const LIGHT='#FBEAEA'
export const DARK_TEXT='text-white'
export const LIGHT_TEXT='text-gray-900'
export const DARK_BTN='bg-[#B03060] hover:bg-[#FF4D6D] text-white'
export const LIGHT_BTN='bg-[#800000] hover:bg-[#5C0000] text-white'
export const HOVER_TINT='#5C0000'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


//get user from firestore by id


export async function getUserFromFirestore(userId: string) {

  const docRef = doc(db, "profiles", userId);
  const snap = await getDoc(docRef);

  return snap.exists() ? snap.data() : null;
}


export const isEndTimeAfterStart = (startTime: string, endTime: string): boolean => {

  

  const toMinute = (timeStr: string): number => {

    if (timeStr.endsWith('m') || timeStr.endsWith('M')) {

      const [time, modifier] = timeStr.trim().split(' ');
      let [hours, minute] = time.split(':').map(Number);

      if (modifier && modifier.toLowerCase() === 'pm' && hours !== 12) {
        hours += 12;
      }

      if (modifier && modifier.toLowerCase() === 'am' && hours === 12) {
        hours = 0;
      }
      return hours * 60 + minute;
    } else {

      let [hours, minute] = timeStr.trim().split(':').map(Number);
      return hours * 60 + minute;
    }
  }



  return toMinute(startTime) < toMinute(endTime)

}



export const listenToNotifications =(userId: string, callback: (notifs: any[]) => void) =>{
 const q = query(
  collection(db, `notifications/${userId}/items`),
  where('seen', '==', false),   // only unseen notifications
  orderBy('timestamp', 'desc')  // latest first
)

  const unsubscribe = onSnapshot(q, snapshot => {
    const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(notifs);
  });

  return unsubscribe;
}

export const generateZoomAuthUrl=(state?: string)=>{
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.ZOOM_CLIENT_ID!,
    redirect_uri: process.env.ZOOM_REDIRECT_URL!,
  });
  if (state) params.append('state', state);
  return `https://zoom.us/oauth/authorize?${params.toString()}`;
}

export const refreshZoomTokens=async(refreshToken: string)=>{

    const basicAuth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) return null;
  console.log('couldnt refresh the zoom token')
  return await res.json();

}

