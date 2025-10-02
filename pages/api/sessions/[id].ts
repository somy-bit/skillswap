import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    const { status } = req.body;
    
    // In a real app, update your database here
    console.log(`Updating session ${id} status to: ${status}`);
    
    res.status(200).json({ 
      id, 
      status, 
      message: 'Session status updated successfully' 
    });
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
