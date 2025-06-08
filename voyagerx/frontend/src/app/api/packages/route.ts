import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();
    
    // Remove packageId from the data since MongoDB will generate _id
    const { packageId, ...packageData } = data;
    
    const result = await db.collection('packages').insertOne(packageData);
    
    return NextResponse.json({ 
      success: true, 
      package: { _id: result.insertedId, ...packageData } 
    });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create package' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const packages = await db.collection('packages').find({}).toArray();
    
    return NextResponse.json({ success: true, packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
} 