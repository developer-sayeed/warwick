import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const db = await getDatabase()
    const settings = await db.collection('settings').findOne({})
    return NextResponse.json(settings || {})
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDatabase()
    const body = await request.json()

    const existingSettings = await db.collection('settings').findOne({})

    if (existingSettings) {
      // Remove _id from body if it exists to avoid immutable field error
      const { _id, ...updateData } = body
      await db.collection('settings').updateOne(
        { _id: existingSettings._id },
        { $set: updateData }
      )
    } else {
      await db.collection('settings').insertOne(body)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
