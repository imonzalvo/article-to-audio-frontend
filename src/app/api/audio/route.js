import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import fs from 'fs'
import path from 'path'

export async function GET(request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const filePath = path.join(process.cwd(), 'public', 'audio.mp3')
  const stat = fs.statSync(filePath)

  const headers = new Headers()
  headers.set('Content-Type', 'audio/mpeg')
  headers.set('Content-Length', stat.size)

  const stream = fs.createReadStream(filePath)

  return new NextResponse(stream, { headers })
}
