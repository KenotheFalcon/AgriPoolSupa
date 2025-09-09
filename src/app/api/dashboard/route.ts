import { NextResponse } from 'next/server';
import { withRole, AuthenticatedRequest } from '@/lib/middleware/with-auth';
import { getAdminFirestore } from '@/lib/firebase-admin';

async function getDashboardData() {
  const db = await getAdminFirestore();
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Get performance metrics
  const metricsSnapshot = await db
    .collection('performance_metrics')
    .where('createdAt', '>=', twentyFourHoursAgo)
    .orderBy('createdAt', 'asc')
    .get();

  const performance = {
    fcp: metricsSnapshot.docs.map((doc) => doc.data().fcp),
    lcp: metricsSnapshot.docs.map((doc) => doc.data().lcp),
    fid: metricsSnapshot.docs.map((doc) => doc.data().fid),
    cls: metricsSnapshot.docs.map((doc) => doc.data().cls),
    ttfb: metricsSnapshot.docs.map((doc) => doc.data().ttfb),
    timestamps: metricsSnapshot.docs.map((doc) => doc.data().createdAt),
  };

  // Get user statistics
  const usersSnapshot = await db.collection('users').get();
  const userStats = {
    total: usersSnapshot.size,
    active: 0,
    inactive: 0,
    verified: 0,
    unverified: 0,
    byRole: {
      admin: 0,
      user: 0,
    },
  };

  usersSnapshot.forEach((doc) => {
    const user = doc.data();
    if (user.status === 'active') userStats.active++;
    if (user.status === 'inactive') userStats.inactive++;
    if (user.emailVerified) userStats.verified++;
    else userStats.unverified++;
    if (user.role === 'admin') userStats.byRole.admin++;
    if (user.role === 'user') userStats.byRole.user++;
  });

  const users = {
    total: userStats.total,
    active: userStats.active,
    inactive: userStats.inactive,
    verified: userStats.verified,
    unverified: userStats.unverified,
    byRole: userStats.byRole,
    byStatus: {
      active: userStats.active,
      inactive: userStats.inactive,
    },
  };

  return NextResponse.json({
    performance,
    users,
  });
}

export const GET = withRole(['admin'])(getDashboardData);
