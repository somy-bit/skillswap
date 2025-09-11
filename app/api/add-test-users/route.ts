import { adminDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

const testUsers = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@test.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    description: "Full-stack developer with expertise in React and Node.js. Passionate about creating user-friendly applications.",
    occupation: "Technology & IT",
    experience: 5,
    location: "San Francisco, CA",
    skills: ["React", "Node.js", "JavaScript", "Python"],
    phone: "+1234567890",
    password: "password123",
    dateOfBirth: new Date('1990-05-15'),
    achievements: "Built 3 successful web applications, AWS certified",
    socailLinks: ["https://linkedin.com/in/sarahjohnson"]
  },
  {
    name: "Michael Chen",
    email: "michael.chen@test.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    description: "Financial analyst with 8 years of experience in investment banking and portfolio management.",
    occupation: "Business & Finance",
    experience: 8,
    location: "New York, NY",
    skills: ["Financial Analysis", "Excel", "Bloomberg", "Risk Management"],
    phone: "+1234567891",
    password: "password123",
    dateOfBirth: new Date('1985-03-22'),
    achievements: "CFA certified, managed $50M portfolio",
    socailLinks: ["https://linkedin.com/in/michaelchen"]
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@test.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    description: "Elementary school teacher specializing in STEM education and curriculum development.",
    occupation: "Education & Training",
    experience: 6,
    location: "Austin, TX",
    skills: ["Curriculum Design", "STEM Education", "Classroom Management", "Educational Technology"],
    phone: "+1234567892",
    password: "password123",
    dateOfBirth: new Date('1988-09-10'),
    achievements: "Teacher of the Year 2022, Published educational materials",
    socailLinks: ["https://linkedin.com/in/emilyrodriguez"]
  },
  {
    name: "Dr. James Wilson",
    email: "james.wilson@test.com",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    description: "Registered nurse with specialization in emergency medicine and patient care coordination.",
    occupation: "Health & Wellness",
    experience: 10,
    location: "Chicago, IL",
    skills: ["Emergency Medicine", "Patient Care", "Medical Equipment", "Healthcare Management"],
    phone: "+1234567893",
    password: "password123",
    dateOfBirth: new Date('1982-12-05'),
    achievements: "BSN degree, Emergency Medicine certification",
    socailLinks: ["https://linkedin.com/in/jameswilson"]
  },
  {
    name: "Alexandra Kim",
    email: "alexandra.kim@test.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    description: "UX/UI designer with a passion for creating intuitive and beautiful digital experiences.",
    occupation: "Creative & Design",
    experience: 4,
    location: "Los Angeles, CA",
    skills: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Prototyping"],
    phone: "+1234567894",
    password: "password123",
    dateOfBirth: new Date('1992-07-18'),
    achievements: "Design award winner, 50+ successful projects",
    socailLinks: ["https://linkedin.com/in/alexandrakim"]
  },
  {
    name: "Dr. Robert Martinez",
    email: "robert.martinez@test.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    description: "Research scientist specializing in biotechnology and pharmaceutical development.",
    occupation: "Science & Research",
    experience: 12,
    location: "Boston, MA",
    skills: ["Biotechnology", "Research Methods", "Data Analysis", "Laboratory Management"],
    phone: "+1234567895",
    password: "password123",
    dateOfBirth: new Date('1978-11-30'),
    achievements: "PhD in Biochemistry, 15 published papers",
    socailLinks: ["https://linkedin.com/in/robertmartinez"]
  },
  {
    name: "Jennifer Davis",
    email: "jennifer.davis@test.com",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    description: "Corporate lawyer specializing in contract law and business compliance.",
    occupation: "Legal & Government",
    experience: 9,
    location: "Washington, DC",
    skills: ["Contract Law", "Business Compliance", "Legal Research", "Negotiation"],
    phone: "+1234567896",
    password: "password123",
    dateOfBirth: new Date('1984-04-12'),
    achievements: "JD from Harvard Law, Bar certified in 3 states",
    socailLinks: ["https://linkedin.com/in/jenniferdavis"]
  },
  {
    name: "Carlos Thompson",
    email: "carlos.thompson@test.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    description: "Hotel manager with extensive experience in luxury hospitality and customer service.",
    occupation: "Hospitality & Service",
    experience: 7,
    location: "Miami, FL",
    skills: ["Hotel Management", "Customer Service", "Event Planning", "Staff Training"],
    phone: "+1234567897",
    password: "password123",
    dateOfBirth: new Date('1986-08-25'),
    achievements: "Hospitality Management degree, 5-star hotel experience",
    socailLinks: ["https://linkedin.com/in/carlosthompson"]
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@test.com",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    description: "Life coach and wellness consultant helping people achieve their personal and professional goals.",
    occupation: "Lifestyle & Personal Development",
    experience: 3,
    location: "Denver, CO",
    skills: ["Life Coaching", "Wellness Consulting", "Mindfulness", "Goal Setting"],
    phone: "+1234567898",
    password: "password123",
    dateOfBirth: new Date('1991-01-08'),
    achievements: "Certified Life Coach, 100+ successful clients",
    socailLinks: ["https://linkedin.com/in/lisaanderson"]
  },
  {
    name: "David Park",
    email: "david.park@test.com",
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
    description: "Data scientist with expertise in machine learning and artificial intelligence applications.",
    occupation: "Technology & IT",
    experience: 6,
    location: "Seattle, WA",
    skills: ["Machine Learning", "Python", "Data Analysis", "AI Development"],
    phone: "+1234567899",
    password: "password123",
    dateOfBirth: new Date('1989-06-14'),
    achievements: "MS in Data Science, AI research publications",
    socailLinks: ["https://linkedin.com/in/davidpark"]
  }
];

export async function POST() {
  try {
    console.log('Adding test users and profiles...');
    
    const batch = adminDb.batch();
    
    testUsers.forEach((user) => {
      const docRef = adminDb.collection('profiles').doc();
      batch.set(docRef, {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
        isMentor: true,
        rating: Math.floor(Math.random() * 2) + 4 + Math.random() // 4.0 - 5.9
      });
    });
    
    await batch.commit();
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully added ${testUsers.length} test users!` 
    });
  } catch (error) {
    console.error('Error adding test users:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add test users' 
    }, { status: 500 });
  }
}
