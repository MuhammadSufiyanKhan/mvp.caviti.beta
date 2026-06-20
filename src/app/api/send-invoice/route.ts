import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import InvoiceEmail from '@/emails/invoice';

export async function POST(request: Request) {
  try {
    const { email, planName, amount } = await request.json();

    const data = await resend.emails.send({
      from: 'Caviti <onboarding@resend.dev>',
      to: [email],
      subject: 'Invoice for your Caviti.io subscription',
      react: InvoiceEmail({ planName, amount }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
