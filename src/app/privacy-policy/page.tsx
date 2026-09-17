import Card from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
        <Card className="p-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-white/60 mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-white/80 mb-4">
              This Privacy Policy describes how Bagma Lifestyle collects, uses, and protects your personal information.
            </p>
            <h2 className="text-white text-xl font-bold mt-6 mb-3">Information We Collect</h2>
            <p className="text-white/80 mb-4">
              We collect information you provide directly, including when you create an account, place an order, or book a carwash service.
            </p>
            <h2 className="text-white text-xl font-bold mt-6 mb-3">How We Use Your Information</h2>
            <p className="text-white/80 mb-4">
              We use your information to process orders, communicate with you, and improve our services.
            </p>
            <h2 className="text-white text-xl font-bold mt-6 mb-3">Data Security</h2>
            <p className="text-white/80 mb-4">
              We implement appropriate security measures to protect your personal information.
            </p>
            <p className="text-white/60 mt-8">
              This is a placeholder privacy policy. The full policy will be added before launch.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
