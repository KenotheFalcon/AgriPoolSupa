import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChecklistManager } from './checklist-manager';

async function getChecklist() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('config')
    .select('value')
    .eq('key', 'verification_checklist')
    .single();

  if (error || !data) {
    return [];
  }

  return data.value?.items || [];
}

export default async function AdminVerificationPage() {
  const checklistItems = await getChecklist();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Verification Checklist</CardTitle>
        <CardDescription>
          Add or remove the requirements farmers must meet to become a &ldquo;Verified
          Farmer&rdquo;.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChecklistManager initialItems={checklistItems} />
      </CardContent>
    </Card>
  );
}
