import { requireRole } from '@/lib/auth/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

async function getVerificationData(farmerId: string) {
  const db = await getAdminFirestore();

  const checklistDoc = await db.collection('agripoolConfig').doc('verificationChecklist').get();
  const checklistItems = checklistDoc.exists ? checklistDoc.data()?.items || [] : [];

  const progressSnapshot = await db
    .collection('users')
    .doc(farmerId)
    .collection('verificationProgress')
    .get();
  const progress = progressSnapshot.docs.reduce((acc, doc) => {
    acc[doc.id] = doc.data();
    return acc;
  }, {} as any);

  const farmerDoc = await db.collection('users').doc(farmerId).get();
  const isVerified = farmerDoc.data()?.isVerified || false;

  return { checklistItems, progress, isVerified };
}

export default async function FarmerVerificationPage() {
  const user = await requireRole('farmer');
  const { checklistItems, progress, isVerified } = await getVerificationData(user.uid);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <div>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>
              Complete these steps to become a "Verified Farmer" and gain more trust from buyers.
            </CardDescription>
          </div>
          {isVerified ? (
            <Badge className='bg-green-600 text-white'>Verified Farmer</Badge>
          ) : (
            <Badge variant='secondary'>Not Verified</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className='space-y-4'>
          {checklistItems.map((item: string, index: number) => {
            const itemId = slugify(item);
            const isCompleted = progress[itemId]?.status === 'completed';
            return (
              <li key={index} className='flex items-center gap-4 p-3 bg-muted rounded-md'>
                {isCompleted ? (
                  <CheckCircle2 className='h-6 w-6 text-green-500' />
                ) : (
                  <Circle className='h-6 w-6 text-gray-400' />
                )}
                <span className={`flex-grow ${isCompleted ? 'text-gray-500 line-through' : ''}`}>
                  {item}
                </span>
              </li>
            );
          })}
        </ul>
        {checklistItems.length === 0 && (
          <p className='text-center text-muted-foreground'>
            The verification checklist has not been set up by an admin yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
