'use client'

import Steps from '@/components/Steps';
import { Input } from '@/components/ui/input'
import { DARK_BG, DARK_BTN, DARK_TEXT, LIGHT_BG, LIGHT_BTN, LIGHT_TEXT } from '@/lib/utils'
import { toast } from 'react-toastify';
import 'react-day-picker/dist/style.css';
import React, { useState } from 'react'
import ImageUploader from '@/components/ImageUploader';
import CalendarDOB from '@/components/CalenderDOB';
import { Profile } from '@/types/type';
import { EyeClosed, EyeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';


function SignUp() {

    const locations = [
        'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
        'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
        'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
        'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
        'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
        'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
        'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA',
        'Mesa, AZ', 'Kansas City, MO', 'Atlanta, GA', 'Long Beach, CA', 'Colorado Springs, CO',
        'Raleigh, NC', 'Miami, FL', 'Virginia Beach, VA', 'Omaha, NE', 'Oakland, CA',
        'Minneapolis, MN', 'Tulsa, OK', 'Arlington, TX', 'Tampa, FL', 'New Orleans, LA'
    ];

    const occupations = [
        'Technology & IT',
        'Business & Finance',
        'Education & Training',
        'Health & Wellness',
        'Creative & Design',
        'Science & Research',
        'Legal & Government',
        'Hospitality & Service',
        'Lifestyle & Personal Development'
    ];

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');
    const [occupation, setOccupation] = useState<'Technology & IT' | 'Business & Finance' | 'Education & Training' | 'Health & Wellness' | 'Creative & Design' | 'Science & Research' | 'Legal & Government' | 'Hospitality & Service' | 'Lifestyle & Personal Development' | ''>('');
    const [experience, setExperience] = useState<number>(0);
    const [location, setLocation] = useState('');
    const [achievments, setAchievment] = useState('');
    const [socialLink, setSocialLink] = useState('');
    const [profileImg, setProfileImg] = useState<File | null>(null)
    const [visible, setVisible] = useState<Boolean>(false)

    const router = useRouter()


    const resetForm = () => {
        setName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setPassword('');
        setDateOfBirth(new Date());
        setSkills('');
        setDescription('');
        setOccupation('');
        setExperience(0);
        setLocation('');
        setAchievment('');
        setSocialLink('');
        setProfileImg(null);
        setVisible(false);
    };




    const handleUpload = async () => {

        if (!profileImg) return;
        setLoading(true)
        try {
            const profileData: Profile = {
                name: name + " " + lastName,
                email: email,
                avatar: '',
                description: description,
                occupation: occupation || 'Technology & IT',
                experience: experience,
                location: location,
                skills: skills.trim().split(','),
                socailLinks: socialLink.trim().split(','),
                dateOfBirth: dateOfBirth,
                phone: phone,
                password: password,
                achievements: achievments

            }

            const formData = new FormData();
            formData.append("image", profileImg); // your cropped image
            formData.append("profileData", JSON.stringify(profileData)); // extra field


            const res = await fetch("/api/sign-up", {
                method: "POST",
                body: formData,
            });

            if (res.status === 201) {
                // Auto sign-in after successful sign-up
                await signInWithEmailAndPassword(auth, email, password);
                resetForm();
                toast.success("Account created successfully!");
                router.replace('/dashboard')

            } else if (res.status === 500) {

                toast.error("Sorry! there was a problem in server, please try again later")
            }
        } catch (error) {
            console.log(error);
            toast.error("Sorry! there was a problem in server, please try again later")
        }
        finally {

            setLoading(false)
        }

    };


    return (
        <div className={`pt-10  pb-16 overflow-y-scroll min-h-screen text-gray-900 dark:text-white  p-2 darkbg lightbg`}>

     
            <Steps onFinish={handleUpload} steps={[

                <div className=' w-full flex flex-col items-center justify-center text-center '>
                    <h1 className={`text-3xl font-semibold `}>Create Account</h1>
                    <h3 className='text-xl'>Create an account and enjoy the world of learning and connection</h3>

                    <form className='flex flex-col w-full  max-w-3xl mt-24 p-8 rounded-lg shadow-lg bg-white  mid-darkbg'>
                        <Input type='text' placeholder='Name' name='name' value={name} onChange={e => setName(e.target.value)} className='my-2 h-12' />
                        <Input type='text' placeholder='Last Name' name='lastName' value={lastName} onChange={e => setLastName(e.target.value)} className='my-2 h-12' />
                        <Input type='number' placeholder='Phone' name='phone' value={phone} onChange={e => setPhone(e.target.value)} className='my-2 h-12' />
                        <Input type='email' placeholder='Email' name='email' value={email} onChange={e => setEmail(e.target.value)} className='my-2 h-12' />
                        <div className='relative'>
                            <Input type={`${visible ? "text" : "password"}`} placeholder='Password' name='password'
                                value={password} onChange={e => setPassword(e.target.value)}
                                className='my-2 h-12' />
                            {visible ?
                                (<EyeIcon onClick={() => setVisible(!visible)} className='absolute right-4 top-1/3' />) :
                                (<EyeClosed onClick={() => setVisible(!visible)} className='absolute right-4 top-1/3' />)}
                        </div>


                    </form>

                    <p className='mt-6 text-sm'>
                        Already have an account?{' '}
                        <button 
                            onClick={() => router.push('/sign-in')}
                            className='text-blue-500 hover:underline'
                        >
                            Sign in here
                        </button>
                    </p>

                </div>,
                <div className=' w-full flex flex-col items-center justify-center text-center '>
                    <h1 className={`text-3xl font-semibold `}>Date Of Birth</h1>
                    <h3 className='text-xl mb-24'>enter your date of birth for a better match for finding skills</h3>
                    <CalendarDOB onSelectDate={(date: Date | undefined) => {
                        if (date) setDateOfBirth(date);
                    }} />
                </div>
                ,
                <div className=' w-full flex flex-col items-center justify-center text-center '>
                    <h1 className={`text-3xl font-semibold `}>Personal Details</h1>
                    <h3 className='text-xl'>provide your personal details to enhance your exchanging skills experience </h3>

                    <form className='flex flex-col w-full  max-w-3xl mt-24 p-8  rounded-lg shadow-lg bg-white mid-darkbg'>
                        <div className='mb-4 flex flex-col items-start'>
                            <label htmlFor="occupation">Occupation</label>
                            <select
                                name='occupation'
                                value={occupation}
                                onChange={e => setOccupation(e.target.value as typeof occupation)}
                                className='my-2 h-12 w-full px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600'
                            >
                                <option value="">Select occupation</option>
                                {occupations.map((occ) => (
                                    <option key={occ} value={occ}>{occ}</option>
                                ))}
                            </select>
                        </div>
                        <div className='mb-4 flex flex-col items-start'>
                            <label htmlFor="skills">Skills (comma separated)</label>
                            <Input placeholder='web developer,fitness coach,etc' name='skills'
                                value={skills.toString()}
                                onChange={e => setSkills(e.target.value)}
                                className='my-2 h-12' />
                        </div>
                        <div className='mb-4 flex flex-col items-start'>
                            <label htmlFor="experience">Experience (years)</label>
                            <Input 
                                type='number' 
                                placeholder='Years of experience' 
                                name='experience'
                                value={experience}
                                onChange={e => setExperience(Number(e.target.value))}
                                className='my-2 h-12' 
                                min="0"
                            />
                        </div>
                        <div className='mb-4 flex flex-col items-start'>
                            <label htmlFor="location">Location</label>
                            <select
                                name='location'
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className='my-2 h-12 w-full px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600'
                            >
                                <option value="">Select location</option>
                                {locations.map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        </div>
                    </form>

                </div>,
                <div className=' w-full overflow-y-scroll flex flex-col items-center justify-center text-center '>
                    <h1 className={`text-3xl font-semibold `}>Personal Details</h1>
                    <h3 className='text-xl '>provide your personal details to enhance your exchanging skills experience</h3>
                    <form className='flex flex-col w-full  max-w-3xl mt-16 p-8 bg-gray-50 rounded-lg shadow-lg  dark:bg-gray-800'>
                        <div className='mb-4 h-24 flex flex-col items-start'>
                            <label htmlFor="socialLink">Work Link</label>
                            <textarea
                                placeholder='url to your linked in profile or portfolio'
                                name='socialLink'
                                value={socialLink}
                                onChange={e => setSocialLink(e.target.value)}
                                className='my-2 p-2 w-full h-32 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                            />
                        </div>

                        <div className='mb-4 flex flex-col items-start'>
                            <label htmlFor="description">Brief Description About Yourself</label>
                            <textarea
                                placeholder='I am a web developer with 5 years of experience...'
                                name='description'
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className='my-2 p-2 w-full h-32 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                            />
                        </div>
                        <div className='mb-4 flex flex-col items-start'>
                            <label htmlFor="achievments">Achievments</label>
                            <textarea
                                placeholder='Add some of your achievments here...'
                                name='achievments'
                                value={achievments}
                                onChange={e => setAchievment(e.target.value)}
                                className='my-2 p-2 w-full h-32 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                            />
                        </div>

                    </form>

                </div>,
                <div className=' w-full flex flex-col items-center justify-center text-center '>
                    <h1 className={`text-3xl font-semibold `}>Upload A Photo</h1>
                    <h3 className='text-xl mb-24'>upload a photo to make your profile more appealing</h3>

                    <ImageUploader onImageSelected={(e: File) => setProfileImg(e)} />
                </div>

            ]} />
        </div>
    )
}

export default SignUp