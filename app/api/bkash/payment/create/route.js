import { bkashAuth } from '@/app/api/bkashAuth';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
    const { amount, userId } = await req.json();
    const authSuccess = await bkashAuth(req);

    if (!authSuccess) {
        return NextResponse.json({ success: false, error: 'Authentication failed', status: 401 });
    }

    try {
        const response = await fetch(process.env.BKASH_CREATE_PAYMENT_URL, {
            method: 'POST',
            headers: {
                Host: {process.env.BASE_URL},
                'Content-Type': 'application/json',
                Accept: 'application/json',
                authorization: req.id_token,
                'x-app-key': process.env.BKASH_API_KEY
            },
            body: JSON.stringify({
                mode: '0011',
                payerReference: ' ',
                callbackURL: `${process.env.BASE_URL}/api/bkash/payment/callback?userId=${userId}`,
                amount,
                currency: 'BDT',
                intent: 'sale',
                merchantInvoiceNumber: 'Inv' + uuidv4().substring(0, 5)
            })
        });

        if (!response.ok) {
            throw new Error(`Payment creation failed: ${response.statusText}`);
        }

        const { bkashURL } = await response.json();

        return NextResponse.json({
            success: true,
            status: 200,
            paymentUrl: bkashURL || 'bello'
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message, status: 401 });
    }
}
