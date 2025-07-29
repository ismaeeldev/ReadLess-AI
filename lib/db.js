"use server";
import { neon } from '@neondatabase/serverless';
import { auth, currentUser } from "@clerk/nextjs/server";
import { randomUUID } from 'crypto';

const sql = neon(process.env.DATABASE_URL);

async function savePdfSummary({ original_file_url, summary_text, title, file_name }) {
  const { userId } = await auth();
  const user = await currentUser();

  const email = user.emailAddresses?.[0]?.emailAddress || "unknown@example.com";
  const fullName = user.fullName || "Anonymous";

  if (!userId || !user) {
    throw new Error("Unauthorized: Clerk user not found.");
  }

  try {
    const existing = await sql`
  SELECT 1 FROM users WHERE id = ${userId} OR email = ${email}
`;

    if (existing.length === 0) {
      await sql`
    INSERT INTO users (id, email, full_name)
    VALUES (${userId}, ${email}, ${fullName});
  `;
    }


    await new Promise((res) => setTimeout(res, 200));

    const result = await sql`
      INSERT INTO pdf_summaries 
        (user_id, original_file_url, status ,summary_text, title, file_name)
      VALUES 
        (${userId}, ${original_file_url}, 'Completed', ${summary_text}, ${title}, ${file_name})
      RETURNING *;
    `;

    if (!result || result.length === 0) {
      throw new Error("Summary save failed: No result returned.");
    }

    return result[0];

  } catch (error) {
    console.error("❌ Error saving PDF summary:", error);
    throw new Error("Could not save summary. Please try again.");
  }
}


async function getPdfSummaries() {
  const { userId } = await auth();
  console.log("userId", userId);
  if (!userId) {
    throw new Error("Unauthorized: No Clerk user found");
  }

  try {
    const summaries = await sql`
      SELECT * FROM pdf_summaries
      WHERE user_id = ${userId}
      ORDER BY id DESC;
    `;
    return summaries;
  } catch (error) {
    console.error("Error fetching PDF summaries:", error);
    throw error;
  }
}

async function deletePdfSummary(id) {
  try {
    await sql`
      DELETE FROM pdf_summaries
      WHERE id = ${id};
    `;
    return { success: true };
  } catch (error) {
    console.error("Error deleting PDF summary:", error);
    throw error;
  }
}

async function getPdfSummary(id) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: No Clerk user found");
  }

  try {
    const summary = await sql`
      SELECT * FROM pdf_summaries
      WHERE id = ${id} AND user_id = ${userId};
    `;
    return summary[0];
  } catch (error) {
    console.error("Error fetching PDF summary:", error);
    throw error;
  }
}

async function handleCheckoutSessionCompleted({ session }) {
  try {
    const fullName = session.customer_details?.name || 'unknown';
    const email = session.customer_details?.email;
    const customerId = session.customer;
    const priceId =
      session?.metadata?.price_id ||
      session?.metadata?.plan_id ||
      session.line_items?.data[0]?.price?.id ||
      null;
    const stripePaymentId = session.id;
    const amount = session.amount_total;
    const paymentStatus = session.payment_status;

    if (!email || !customerId) {
      throw new Error("Missing required customer information from Stripe session.");
    }

    let plan = 'unknown';
    if (priceId === 'price_1RnwEMFTrir0oOuVCm5qYOrw') plan = 'pro';
    else if (priceId === 'price_1RnwJ6FTrir0oOuVFCACL3vQ') plan = 'enterprise';

    const existing = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existing.length === 0) {
      await sql`
        INSERT INTO users (id, full_name, email, status, plan, customer_id)
        VALUES (
          ${randomUUID()},
          ${fullName},
          ${email},
          'active',
          ${plan},
          ${customerId}
        )
      `;
    } else {
      await sql`
        UPDATE users
        SET plan = ${plan}, customer_id = ${customerId}, status = 'active', updated_at = now()
        WHERE email = ${email}
      `;
    }

    await sql`
      INSERT INTO payments (id, amount, status, stripe_payment_id, plan, email)
      VALUES (
        ${randomUUID()},
        ${amount},
        ${paymentStatus},
        ${stripePaymentId},
        ${plan},
        ${email}
      )
    `;
    console.log("✅ User and payment handled successfully");
  } catch (err) {
    console.error("❌ Error in handleCheckoutSessionCompleted:", err);
    throw err;
  }
}

async function handleSubscriptionDeleted({ subscription }) {
  const customerId = subscription.customer;

  await sql`
      UPDATE users
      SET plan = 'free', status = 'inactive'
      WHERE customer_id = ${customerId};
    `;
}

async function getCurrentUserPlan() {
  const user = await currentUser();
  if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
    return { plan: 'starter' };
  }
  const email = user.emailAddresses[0].emailAddress;

  const planResult = await sql`
    SELECT plan FROM users WHERE email = ${email}
  `;
  if (!planResult || planResult.length === 0 || !planResult[0].plan) {
    return { plan: 'starter' };
  }
  return planResult[0];
}

export async function canUserUploadPdf() {
  const user = await currentUser();
  const email = user.emailAddresses[0].emailAddress || 'test@test.com';
  const userId = user.id;

  const planResult = await sql`
    SELECT plan FROM users WHERE email = ${email}
  `;

  const plan = planResult.length > 0 ? planResult[0].plan : 'starter';
  console.log("plan", plan);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const uploads = await sql`
    SELECT COUNT(*) FROM pdf_summaries
    WHERE user_id = ${userId} AND created_at >= ${today.toISOString()}
  `;
  const uploadsToday = Number(uploads[0].count);

  if (plan === "starter" && uploadsToday >= 2) return false;
  if (plan === "pro" && uploadsToday >= 10) return false;
  if (plan === "enterprise") return true;

  return true;
}


export { sql, savePdfSummary, getPdfSummaries, getCurrentUserPlan, deletePdfSummary, getPdfSummary, handleCheckoutSessionCompleted, handleSubscriptionDeleted };
