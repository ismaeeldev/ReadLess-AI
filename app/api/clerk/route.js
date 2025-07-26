import { NextResponse } from 'next/server';
import sql from '@/lib/db';
// import { buffer } from 'micro';
import crypto from 'crypto';


export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    const rawBody = await req.text();
    const secret = process.env.CLERK_WEBHOOK_SECRET;

    const signature = req.headers.get('clerk-signature');
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

    if (signature !== expectedSignature) {
        return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const { type, data } = JSON.parse(rawBody);

    if (type === 'user.created') {
        const user = data;

        const userId = user.id;
        const email = user.email_addresses?.[0]?.email_address || '';
        const fullName = user.first_name + ' ' + user.last_name;

        try {
            await sql`
        INSERT INTO users (id, email, full_name)
        VALUES (${userId}, ${email}, ${fullName});
      `;
            return NextResponse.json({ message: 'User saved' }, { status: 200 });
        } catch (error) {
            console.error('DB insert error:', error);
            return NextResponse.json({ message: 'Error saving user' }, { status: 500 });
        }
    }

    return NextResponse.json({ message: 'Unhandled event' }, { status: 200 });
}
