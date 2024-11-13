import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Footer } from '@/components/ui/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Repuestos Usados - Marketplace',
  description: 'Compra y venta de repuestos usados para autos y motos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}