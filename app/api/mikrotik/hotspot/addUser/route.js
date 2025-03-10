import { paymentRefundInBkash } from '@/app/actions/payment';
import { getExpirationDate } from '@/lib/convertData';
import connectToRouter from '@/lib/mikrotik';
import Payment from '@/modals/payment-modal';
import { createHotspotUser } from '@/queries/hotspotUser';
import { getPackageById } from '@/queries/package';
import { getUserById } from '@/queries/user';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    const { packageId, userId, data } = await req.json();
    const user = await getUserById(userId);
    const getPackage = await getPackageById(packageId);

    try {
        const paymentData = {
            userId,
            amount: data?.amount,
            transactionId: data?.trxID,
            packageId,
            paymentId: data?.paymentID,
            merchantInvoiceNumber: data?.merchantInvoiceNumber,
            paymentExecuteTime: data?.paymentExecuteTime,
            customerMsisdn: data?.customerMsisdn,
            paymentMethod: 'bkash'
        };

        // Save payment data to your database
        const createPayment = await Payment.create(paymentData);

        if (createPayment?._id) {
            const conn = await connectToRouter();
            const results = await conn.write('/ip/hotspot/user/add', [
                `=name=${user?.phone}`,
                `=password=${user?.phone}`,
                `=profile=${getPackage?.profileName}`,
                `=server=${getPackage?.hotspotServer || 'hotspot1'}`,
                `=comment=${user?.name}`
            ]);

            if (results[0]?.ret) {
                const expiredDate = getExpirationDate(getPackage?.validity);
                const hotspotData = {
                    userId,
                    packageId,
                    paymentId: createPayment?._id,
                    hotspotUserId: results[0]?.ret,
                    username: user?.phone,
                    password: user?.phone,
                    expiredAt: expiredDate
                };

                // Save hotspot data to your database
                await createHotspotUser(hotspotData);

                return NextResponse.json({
                    success: true,
                    createPayment
                });
            } else {
                // Payment Refund
                const refundPayment = await paymentRefundInBkash(data?.trxID);
                if (refundPayment?.success) {
                    return NextResponse.json({
                        success: false,
                        message: `Hotspot user creation failed and your payment refund`
                    });
                }
            }
        } else {
            return NextResponse.json({ success: false, message: 'Payment creation failed' });
        }
    } catch (error) {
        if (error.message === 'failure: already have user with this name for this server') {
            // refund payment
            const refundPayment = await paymentRefundInBkash(data?.trxID);
            if (refundPayment?.success) {
                return NextResponse.json({
                    success: false,
                    message: `Hotspot user already exists and your payment refund your bkash account`
                });
            }
        }
    }
};
