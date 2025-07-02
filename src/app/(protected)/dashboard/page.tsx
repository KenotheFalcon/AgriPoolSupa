import { cookies } from 'next/headers';
import { DashboardClient } from './dashboard-client';

async function getDashboardData() {
  const session = cookies().get('session')?.value;
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard`, {
    headers: {
      Cookie: `session=${session}`,
    },
  });

  if (!response.ok) {
    // Return a default error state or handle it as you see fit
    return { performance: {}, users: {} };
  }

  return response.json();
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient data={data} />;
}
