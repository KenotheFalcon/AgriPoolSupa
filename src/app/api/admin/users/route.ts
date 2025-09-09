import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware/with-auth';
import { getAdminFirestore } from '@/lib/firebase-admin';

async function getUsers(req: AuthenticatedRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = (page - 1) * limit;

  try {
    const db = await getAdminFirestore();
    const usersRef = db.collection('users');

    const snapshot = await usersRef.orderBy('createdAt', 'desc').limit(limit).offset(offset).get();

    const totalResult = await usersRef.count().get();
    const total = totalResult.data().count;

    return NextResponse.json({
      users: snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          status: data.status,
          emailVerified: data.emailVerified,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      }),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export const GET = withAuth(getUsers);
