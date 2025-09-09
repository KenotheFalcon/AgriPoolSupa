'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PostProduceForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Produce Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is being updated to work with the new Supabase backend according to the PRD.
          Please check back soon for the complete form functionality.
        </p>
      </CardContent>
    </Card>
  );
}