
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase-admin';

export async function GET() {
  try {
    const usersRef = db.collection('users');

    // Query 1: role == 'coach'
    const snapshot1 = await usersRef.where('role', '==', 'coach').get();
    const coaches1 = snapshot1.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Query 2: roles array contains 'coach'
    const snapshot2 = await usersRef.where('roles', 'array-contains', 'coach').get();
    const coaches2 = snapshot2.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      coachesByRole: coaches1.length,
      coachesByRolesArray: coaches2.length,
      data: [...coaches1, ...coaches2]
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 200 });
  }
}
