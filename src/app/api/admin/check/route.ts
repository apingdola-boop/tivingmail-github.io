import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get('admin_auth')?.value;

    return NextResponse.json({
      isAdmin: adminAuth === 'true',
    });
  } catch (error) {
    return NextResponse.json({ isAdmin: false });
  }
}

