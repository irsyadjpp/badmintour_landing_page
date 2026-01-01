import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();

    // Privacy: Only return safe public info
    const publicProfile = {
      id: userId,
      name: userData?.name || 'Anonymous',
      image: userData?.image || '',
      role: userData?.role || 'member',
      level: userData?.level || 'Beginner', // Assuming level exists
      location: userData?.city || 'Indonesia', // Assuming city exists
      joinedAt: userData?.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown',
      bio: userData?.bio || 'No bio yet.',
      // Coach Specifics
      certifications: userData?.certifications || [], // Array of strings
      experienceYears: userData?.experienceYears || 0,
      specialization: userData?.specialization || [], // e.g. ['Singles', 'Doubles']
      rating: userData?.rating || 0,
      reviewCount: userData?.reviewCount || 0,
      stats: {
        matches: userData?.stats?.matches || 0,
        wins: userData?.stats?.wins || 0,
        followers: userData?.followersCount || 0,
        following: userData?.followingCount || 0
      },
      isFollowing: false // Would need auth check to be real
    };

    return NextResponse.json({ success: true, data: publicProfile });

  } catch (error: any) {
    console.error("Profile Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
