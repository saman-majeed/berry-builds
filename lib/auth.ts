import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'berrybuilds-secret-2024'

export interface JWTPayload {
  id: number
  username: string
  role: string
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('bb-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function getSessionFromRequest(req: NextRequest): JWTPayload | null {
  const token = req.cookies.get('bb-token')?.value
  if (!token) return null
  return verifyToken(token)
}
