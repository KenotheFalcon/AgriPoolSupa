import { getAdminFirestore } from '@/lib/firebase-admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChecklistManager } from './checklist-manager';

async function getChecklist() {
  const db = await getAdminFirestore();
  const doc = await db.collection('agripoolConfig').doc('verificationChecklist').get();
  if (!doc.exists) return [];
  return doc.data()?.items || [];
}

export default async function AdminVerificationPage() {
  const checklistItems = await getChecklist();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Verification Checklist</CardTitle>
        <CardDescription>
          Add or remove the requirements farmers must meet to become a "Verified Farmer".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChecklistManager initialItems={checklistItems} />
      </CardContent>
    </Card>
  );
}
