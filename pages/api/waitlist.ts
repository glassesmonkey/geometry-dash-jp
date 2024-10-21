import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const email = session.user.email

  try {
    const waitlistEntry = await prisma.waitlist.create({
      data: { email },
    })

    return res.status(200).json({ message: 'Email added to waitlist', data: waitlistEntry })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed on the fields: (`email`)')) {
        return res.status(400).json({ error: 'This email is already on the waitlist' })
      }
      console.error('Database error:', error)
      return res.status(500).json({ error: `Database error: ${error.message}` })
    }
    console.error('Unexpected error:', error)
    return res.status(500).json({ error: 'An unexpected error occurred' })
  }
}