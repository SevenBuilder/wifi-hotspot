import { getPaymentById, updatePaymentInfo } from '@/queries/payment';
import CheckPayment from './_components/CheckPayment';
import { CircleX } from 'lucide-react';

const PaymentPage = async ({ searchParams: { success, trxID, paymentId } }) => {
    if (paymentId && trxID && success) {
        try {
            const getPayment = await getPaymentById(paymentId);
            const matches =
                getPayment.transactionId === trxID &&
                getPayment.id === paymentId &&
                getPayment.status === 'pending';

            if (matches) {
                await updatePaymentInfo(paymentId, {
                    status: 'paid'
                });
                return <CheckPayment user={getPayment?.userId} />;
            } else {
                return (
                    <div className='flex flex-col items-center justify-center flex-1 w-full h-full my-16'>
                        <div className='flex flex-col items-center max-w-full gap-6 text-center'>
                            <>
                                <CircleX className='w-32 h-32 p-0 text-white bg-red-500 rounded-full' />{' '}
                                <h1 className='text-xl md:text-2xl lg:text-3xl'>
                                    <strong>{getPayment?.userId?.name}</strong>, your payment
                                    details wrong please pay again
                                </h1>
                            </>
                        </div>
                    </div>
                );
            }
        } catch (error) {
            throw new Error(error);
        }
    }
};

export default PaymentPage;
