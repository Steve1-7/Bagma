'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, Package, Truck } from 'lucide-react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';

export default function TrackOrderPage() {
  // TODO: This should fetch actual order data from Supabase based on order ID
  // For now, showing a sample order tracking interface

  const orderStatus = 'preparing'; // Would come from actual order data
  const orderNumber = '12345';

  const statusSteps = [
    { key: 'received', label: 'Order Received', icon: Package },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Being Prepared', icon: Clock },
    { key: 'ready', label: 'Ready', icon: CheckCircle },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = statusSteps.findIndex((step) => step.key === orderStatus);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Track Your Order</h1>

        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-white/60 text-sm">Order Number</div>
              <div className="text-white font-bold text-xl">#{orderNumber}</div>
            </div>
            <Badge variant="success" className="text-sm">
              {orderStatus.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Progress Timeline */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-charcoal/50" />
            <div className="space-y-8">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                        isCompleted
                          ? 'bg-green-500'
                          : isCurrent
                          ? 'bg-red'
                          : 'bg-charcoal'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div
                        className={`font-medium ${
                          isCurrent ? 'text-white' : 'text-white/60'
                        }`}
                      >
                        {step.label}
                      </div>
                      {isCurrent && (
                        <div className="text-white/40 text-sm mt-1">
                          In progress...
                        </div>
                      )}
                      {isCompleted && !isCurrent && (
                        <div className="text-green-500 text-sm mt-1">Completed</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Order Details</h2>
          <div className="space-y-3 text-white/80">
            <div className="flex justify-between">
              <span>Order Type</span>
              <span className="text-white">Collection</span>
            </div>
            <div className="flex justify-between">
              <span>Placed At</span>
              <span className="text-white">Today, 2:30 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Ready</span>
              <span className="text-white">Today, 3:00 PM</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-charcoal/50">
            <h3 className="text-white font-medium mb-3">Items</h3>
            <p className="text-sm text-white/50">Order items and totals will appear here when an order number is supplied.</p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-white/60 mb-4">
            Need help with your order?
          </p>
          <Button variant="outline" asChild>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '') || ''}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
