import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { monitoringService } from '@/lib/monitoring';
import { z } from 'zod';

// Validation schema for alert creation
const createAlertSchema = z.object({
  type: z.enum(['performance', 'error', 'warning']),
  message: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

/**
 * GET /api/monitoring/alerts
 * Get all alerts (requires read:alerts permission)
 */
export const GET = withAuth(
  async function getAlerts(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const type = searchParams.get('type');
      const status = searchParams.get('status');
      const limit = parseInt(searchParams.get('limit') || '10');
      const offset = parseInt(searchParams.get('offset') || '0');

      const alerts = await monitoringService.getAlerts({
        type: type as any,
        status: status as any,
        limit,
        offset,
      });

      return NextResponse.json({ alerts });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }
  },
  { requiredPermissions: ['read:alerts'] }
);

/**
 * POST /api/monitoring/alerts
 * Create a new alert (requires write:alerts permission)
 */
export const POST = withAuth(
  async function createAlert(req: NextRequest) {
    try {
      const body = await req.json();
      const { type, message, metadata } = createAlertSchema.parse(body);

      const alert = await monitoringService.addAlert({
        type,
        message,
        metadata,
      });

      return NextResponse.json({ alert }, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Error creating alert:', error);
      return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
    }
  },
  { requiredPermissions: ['write:alerts'] }
);

/**
 * PATCH /api/monitoring/alerts/:id
 * Update alert status (requires write:alerts permission)
 */
export const PATCH = withAuth(
  async function updateAlert(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');
      const body = await req.json();
      const { status } = z
        .object({
          status: z.enum(['new', 'acknowledged', 'resolved']),
        })
        .parse(body);

      if (!id) {
        return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
      }

      const alert = await monitoringService.updateAlertStatus(id, status);
      return NextResponse.json({ alert });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input', details: error.errors },
          { status: 400 }
        );
      }

      console.error('Error updating alert:', error);
      return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
    }
  },
  { requiredPermissions: ['write:alerts'] }
);

/**
 * DELETE /api/monitoring/alerts/:id
 * Delete an alert (requires delete:alerts permission)
 */
export const DELETE = withAuth(
  async function deleteAlert(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
      }

      await monitoringService.deleteAlert(id);
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error('Error deleting alert:', error);
      return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
    }
  },
  { requiredPermissions: ['delete:alerts'] }
);
