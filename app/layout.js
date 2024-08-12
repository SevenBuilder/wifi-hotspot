import ThemeProvider from '@/Providers/ThemeProvider';
import './globals.css';
import { Toaster } from 'sonner';
import { dbConnect } from '@/lib/mongo';
import SessionProvider from '@/Providers/SessionProvider';

export const metadata = {
    title: 'Wifi Hotspot',
    description: 'Generated by Wifi Hotspot'
};

export default async function RootLayout({ children }) {
    // Connect to MongoDB database
    const cont = await dbConnect();
    return (
        <html lang='en'>
            <body>
                <ThemeProvider>
                    <SessionProvider>{children}</SessionProvider>
                </ThemeProvider>
                <Toaster richColors position='top-center' duration={4000} />
            </body>
        </html>
    );
}
