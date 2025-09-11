import { Timestamp } from "firebase-admin/firestore";

export type Profile = {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  description: string;
  socailLinks?: string[];
  achievements?: string;
  occupation: 'Technology & IT' | 'Business & Finance' | 'Education & Training' | 'Health & Wellness' | 'Creative & Design' | 'Science & Research' | 'Legal & Government' | 'Hospitality & Service' | 'Lifestyle & Personal Development';
  experience: number;
  location: string;
  skills: string[];
  isMentor?: boolean;
  availability?: string[];
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
 dateOfBirth:Date;
password:string;
phone:string;
}


export type User = {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  zoomAccessToken?: string;
  zoomRefreshToken?: string;
}

export type Slot = {
  id?: string;
  date: string,           // e.g. '2025-08-01'
  startTime: string,      // '14:00'
  endTime: string,        // '15:00'
  isBooked: boolean,
}

export type Session = {
  id?: string;
  mentorId: string,       // profile owner
  menteeId: string,       // the one booking
  date: string,
  startTime: string,
  endTime: string,
  duration?: number,       // in minutes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  skill: string;
  message: string;
  isSwapSession?: boolean; // indicates if this session was created from a swap
  originalSessionId?: string; // reference to original session if this is a swap
  swapRequestId?: string; // reference to the swap request that created this
  zoom?: {
    meetingId: string;
    joinUrl: string;
    startUrl: string;
  }
}

export type SessionWithProfile = {
  mentorId: string,       // profile owner
  menteeId: string,       // the one booking
  date: string,
  startTime: string,
  endTime: string,
  duration?: number,       // in minutes
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  createdAt?: Timestamp, //turn into date if got error
  skill: string;
  message: string;
  id: string;
  zoom?: {
    meetingId: string;
    joinUrl: string;
    startUrl: string;
  }
  mentorProfile: Profile;
  menteeProfile: Profile;

}

export type Message = {
  senderId: string,
  receiverId: string,
  text: string,
  timestamp: Timestamp,
  sessionId?: string,    // optional link to a session
}

export type Notification = {
  type: 'booking' | 'message' | 'reminder' | 'session_confirmed' | 'session_cancelled' | 'session_completed',
  senderId: string,
  message: string,
  timestamp: Timestamp,
  seen: boolean,
  sessionId?: string, // e.g., sessionId or message thread
  id?: string,
}