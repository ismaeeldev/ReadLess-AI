import { NextResponse } from "next/server";
import Stripe from "stripe";
import { handleCheckoutSessionCompleted, handleSubscriptionDeleted } from "@/lib/db";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const POST = async (req) => {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature");
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);

        switch (event.type) {
            case "checkout.session.completed": {
                console.log("checkout.session.completed");
                const sessionId = event.data.object.id;
                const session = await stripe.checkout.sessions.retrieve(sessionId, {
                    expand: ['line_items', 'customer_details']
                });
                await handleCheckoutSessionCompleted({ session });
                break;
            }

            case "customer.subscription.deleted": {
                console.log("customer.subscription.deleted");
                const subscription = event.data.object;
                await handleSubscriptionDeleted({ subscription });
                break;
            }

            default:
                console.log(`⚠️ Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error(`⚠️ Webhook error: ${err.message}`);
        return new NextResponse("Webhook Error", { status: 400 });
    }
};
