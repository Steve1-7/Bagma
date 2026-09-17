import Link from 'next/link';
import { CheckCircle, Calendar, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';

export default function CarwashBookingConfirmationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <Card className="p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-white/60 mb-8">
            Your carwash booking has been successfully scheduled.
          </p>

          <div className="bg-charcoal/50 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-fire-orange" />
              <div>
                <div className="text-white font-medium">Booking #12345</div>
                <div className="text-white/60 text-sm">Tomorrow at 10:00 AM</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-fire-orange" />
              <div>
                <div className="text-white font-medium">Premium Wash</div>
                <div className="text-white/60 text-sm">SUV • 45 minutes</div>
              </div>
            </div>
            <div className="text-white/80 text-sm">
              You&apos;ll receive a reminder SMS before your appointment.
            </div>
          </div>

          <div className="space-y-3">
            <Button size="lg" className="w-full" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/carwash/book">Book Another</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
