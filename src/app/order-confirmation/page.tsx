import Link from 'next/link';
import { CheckCircle, Home, Package } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

export default async function OrderConfirmationPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-white/60 mb-8">
            Thank you for your order. We&apos;re preparing it with care.
          </p>

          <div className="bg-charcoal/50 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-red" />
              <div>
                <div className="text-white font-medium">Order #{order?.slice(0, 8) || 'received'}</div>
                <div className="text-white/60 text-sm">Placed just now</div>
              </div>
            </div>
            <div className="text-white/80 text-sm">
              You&apos;ll receive updates on your order status via SMS and email.
            </div>
          </div>

          <div className="space-y-3">
            <Button size="lg" className="w-full" asChild>
              <Link href={order ? `/track-order?order=${encodeURIComponent(order)}` : '/track-order'}>Track Your Order</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/order">Order More</Link>
            </Button>
            <Button variant="ghost" size="lg" className="w-full" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
