
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Webhook } from 'svix';
import { headers } from 'next/headers';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  // Handle user.updated event (when plan changes to "monthly")
  if (evt.type === 'user.updated') {
    const userId = evt.data.id;
    const plan = evt.data.public_metadata?.plan;

    // ✅ When user upgrades to monthly, add +30 reports
    if (plan === 'monthly') {
      await convex.mutation(api.subscriptions.addThirtyReports, {
        userId,
      });

      console.log(`✅ Added +30 reports to user ${userId}`);
    }
  }

  return new Response('Webhook processed', { status: 200 });
}
