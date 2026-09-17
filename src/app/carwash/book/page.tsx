'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Badge from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatPrice } from '@/lib/utils';
import { notifyWhatsApp } from '@/lib/notify-whatsapp';

type VehicleType = {
  id: string;
  name: string;
  description: string | null;
  base_price_multiplier: number;
};

type Service = {
  id: string;
  name: string;
  description: string;
  base_price: number;
  duration_minutes: number;
};

type Addon = {
  id: string;
  name: string;
  description: string | null;
  price: number;
};

const supabase = createClient();

export default function CarwashBookPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    notes: '',
  });

  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('carwash_vehicle_types').select('id, name, description, base_price_multiplier').eq('active', true).order('sort_order'),
      supabase.from('carwash_services').select('id, name, description, base_price, duration_minutes').eq('active', true).order('sort_order'),
      supabase.from('carwash_addons').select('id, name, description, price').eq('active', true).order('sort_order'),
    ]).then(([vehicles, serviceRows, addonRows]) => {
      setVehicleTypes(vehicles.data || []);
      setServices(serviceRows.data || []);
      setAddons(addonRows.data || []);
    });
  }, []);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const calculateTotal = () => {
    if (!selectedService || !selectedVehicle) return 0;
    const basePrice = selectedService.base_price * selectedVehicle.base_price_multiplier;
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return basePrice + addonsPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!selectedVehicle || !selectedService || !selectedDate || !selectedTime) throw new Error('Complete all booking details.');
      const { data: { user } } = await supabase.auth.getUser();
      const { error: bookingError } = await supabase.from('carwash_bookings').insert({
        user_id: user?.id || null,
        customer_name: formData.fullName.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email.trim(),
        vehicle_type_id: selectedVehicle.id,
        service_id: selectedService.id,
        addons: selectedAddons,
        booking_date: selectedDate,
        booking_time: selectedTime,
        notes: formData.notes.trim() || null,
        total_price: calculateTotal(),
      });
      if (bookingError) throw bookingError;
      await notifyWhatsApp('carwash', { customer: formData.fullName.trim(), phone: formData.phone.trim(), date: selectedDate, time: selectedTime, service: selectedService.name, vehicle: selectedVehicle.name, total: calculateTotal().toFixed(2) });

      success('Booking confirmed successfully!');
      router.push('/carwash/booking-confirmation');
    } catch (err) {
      error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Book a Carwash</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3, 4, 5].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNum ? 'bg-red' : 'bg-charcoal'
                }`}
              >
                <span className="text-white font-semibold">{stepNum}</span>
              </div>
              {stepNum < 5 && (
                <div className="w-16 h-0.5 bg-charcoal mx-2" />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Vehicle Type */}
          {step === 1 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Select Vehicle Type</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {vehicleTypes.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    type="button"
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedVehicle?.id === vehicle.id
                        ? 'border-red bg-red/10'
                        : 'border-charcoal/50 hover:border-charcoal'
                    }`}
                  >
                    <div className="font-semibold text-white mb-1">{vehicle.name}</div>
                    {vehicle.description && (
                      <div className="text-white/60 text-sm">{vehicle.description}</div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  size="lg"
                  disabled={!selectedVehicle}
                  onClick={() => setStep(2)}
                >
                  Next
                </Button>
              </div>
            </Card>
          )}

          {/* Step 2: Service */}
          {step === 2 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Select Service</h2>
              <div className="space-y-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedService?.id === service.id
                        ? 'border-red bg-red/10'
                        : 'border-charcoal/50 hover:border-charcoal'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white mb-1">{service.name}</div>
                        <div className="text-white/60 text-sm">{service.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gold font-bold">
                          R{Math.round(service.base_price * (selectedVehicle?.base_price_multiplier || 1))}
                        </div>
                        <div className="text-white/60 text-sm">{service.duration_minutes} min</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  size="lg"
                  disabled={!selectedService}
                  onClick={() => setStep(3)}
                >
                  Next
                </Button>
              </div>
            </Card>
          )}

          {/* Step 3: Add-ons */}
          {step === 3 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Add-ons (Optional)</h2>
              <div className="space-y-3">
                {addons.map((addon) => {
                  const isSelected = selectedAddons.find((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-red bg-red/10'
                          : 'border-charcoal/50 hover:border-charcoal'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{addon.name}</div>
                          {addon.description && (
                            <div className="text-white/60 text-sm">{addon.description}</div>
                          )}
                        </div>
                        <div className="text-gold font-semibold">R{addon.price}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button size="lg" onClick={() => setStep(4)}>
                  Next
                </Button>
              </div>
            </Card>
          )}

          {/* Step 4: Date & Time */}
          {step === 4 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Select Date & Time</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Date
                  </label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedTime === time
                            ? 'border-red bg-red/10 text-white'
                            : 'border-charcoal/50 text-white/60 hover:border-charcoal'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button
                  size="lg"
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(5)}
                >
                  Next
                </Button>
              </div>
            </Card>
          )}

          {/* Step 5: Customer Details */}
          {step === 5 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Your Details</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <Input
                    required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <Input
                    required
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="Any special requests?"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-charcoal/50 rounded-lg p-4 mb-6">
                <h3 className="text-white font-semibold mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/80">
                    <span>Vehicle</span>
                    <span className="text-white">{selectedVehicle?.name}</span>
                  </div>
                  <div className="flex justify-between text-white/80">
                    <span>Service</span>
                    <span className="text-white">{selectedService?.name}</span>
                  </div>
                  {selectedAddons.length > 0 && (
                    <div className="flex justify-between text-white/80">
                      <span>Add-ons</span>
                      <span className="text-white">
                        {selectedAddons.map((a) => a.name).join(', ')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/80">
                    <span>Date & Time</span>
                    <span className="text-white">
                      {selectedDate} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-charcoal/50">
                    <span>Total</span>
                    <span className="text-gold">{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(4)}>
                  Back
                </Button>
                <Button size="lg" type="submit" disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </div>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}
