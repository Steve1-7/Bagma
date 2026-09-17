import Card from '@/components/ui/card';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Terms & Conditions</h1>
        <Card className="p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-white/60 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-white/80 mb-4">
              These Terms & Conditions govern your use of the Bagma Lifestyle website and services.
            </p>
            <h2 className="text-white text-xl font-bold mt-6 mb-3">Acceptance of Terms</h2>
            <p className="text-white/80 mb-4">
              By accessing or using our services, you agree to be bound by these terms.
            </p>
            <h2 className="text-white text-xl font-bold mt-6 mb-3">Orders & Payments</h2>
            <p className="text-white/80 mb-4">
              All orders are subject to availability and confirmation. Payment is required at the time of ordering.
            </p>
            <h2 className="text-white text-xl font-bold mt-6 mb-3">Carwash Bookings</h2>
            <p className="text-white/80 mb-4">
              Bookings are subject to availability. Cancellations must be made at least 24 hours in advance.
            </p>
            <h2 className="text-white text-xl font-bold mt-6 mb-3">Limitation of Liability</h2>
            <p className="text-white/80 mb-4">
              Bagma Lifestyle is not liable for any damages arising from the use of our services.
            </p>
            <p className="text-white/60 mt-8">
              This is a placeholder terms and conditions document. The full terms will be added before launch.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
