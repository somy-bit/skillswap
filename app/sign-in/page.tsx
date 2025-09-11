'use client'

import { Input } from '@/components/ui/input'
import { DARK_BG, DARK_BTN, DARK_TEXT, LIGHT_BG, LIGHT_BTN, LIGHT_TEXT } from '@/lib/utils'
import { toast } from 'react-toastify';
import React, { useState } from 'react'
import { EyeClosed, EyeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function SignIn() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState<Boolean>(false);

    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            const res = await fetch("/api/sign-in", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (res.status === 200) {
                toast.success("Sign-in successful!");
                router.replace('/dashboard');
            } else {
                toast.error("Sign-in failed");
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`pt-10 pb-16 min-h-screen dark:${DARK_TEXT} ${LIGHT_TEXT} p-2 ${LIGHT_BG} dark:${DARK_BG}`}>
            <div className='w-full flex flex-col items-center justify-center text-center'>
                <h1 className={`text-3xl font-semibold`}>Welcome Back</h1>
                <h3 className='text-xl'>Sign in to continue your skill-swapping journey</h3>

                <form onSubmit={handleSignIn} className='flex flex-col w-full max-w-md mt-24 p-8 bg-gray-50 rounded-lg shadow-lg dark:bg-gray-800'>
                    <Input 
                        type='email' 
                        placeholder='Email' 
                        name='email' 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className='my-2' 
                        required
                    />
                    <div className='relative'>
                        <Input 
                            type={`${visible ? "text" : "password"}`} 
                            placeholder='Password' 
                            name='password'
                            value={password} 
                            onChange={e => setPassword(e.target.value)}
                            className='my-2' 
                            required
                        />
                        {visible ?
                            (<EyeIcon onClick={() => setVisible(!visible)} className='absolute right-4 top-1/3 cursor-pointer' />) :
                            (<EyeClosed onClick={() => setVisible(!visible)} className='absolute right-4 top-1/3 cursor-pointer' />)
                        }
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`mt-6 py-2 px-4 rounded-lg font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${LIGHT_BTN} dark:${DARK_BTN} text-white`}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <p className='mt-6 text-sm'>
                    Don't have an account?{' '}
                    <button 
                        onClick={() => router.push('/sign-up')}
                        className='text-blue-500 hover:underline'
                    >
                        Sign up here
                    </button>
                </p>
            </div>
        </div>
    );
}

export default SignIn;