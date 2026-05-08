import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Truck, ShieldCheck, CheckCircle2, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/CartContext';
import { Separator } from '@/components/ui/separator';

import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { useAuth } from '@/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CheckoutProps {
  onBack: () => void;
  onSuccess: () => void;
}

type PaymentMethod = 'card' | 'ecocash' | 'mpesa';

export default function Checkout({ onBack, onSuccess }: CheckoutProps) {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postcode: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    mobileNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value).substring(0, 19);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value).substring(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/[^0-9]/gi, '').substring(0, 4);
    } else if (name === 'mobileNumber') {
      formattedValue = value.replace(/[^0-9]/gi, '').substring(0, 10);
    }

    setFormData({ ...formData, [name]: formattedValue });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required';
    } else {
      if (paymentMethod === 'card') {
        const rawCard = formData.cardNumber.replace(/\s/g, '');
        if (rawCard.length < 16) newErrors.cardNumber = 'Enter a valid 16-digit card number';
        if (!formData.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) newErrors.expiry = 'Use MM/YY format';
        if (formData.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
      } else {
        if (formData.mobileNumber.length < 10) newErrors.mobileNumber = 'Enter a valid 10-digit mobile number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (!validateStep()) return;

    if (step < 2) setStep(step + 1);
    else {
      setIsProcessing(true);
      
      const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      try {
        // Save to Firestore: Always save, use 'guest' if not logged in
        const userId = user?.uid || 'guest';
        
        await addDoc(collection(db, 'orders'), {
          orderId,
          userId: userId,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: formData.email,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.postcode}`,
          mobileNumber: formData.mobileNumber,
          isGuest: !user,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.selectedSize,
            image: item.images[0]
          })),
          total: cartTotal,
          status: 'pending',
          createdAt: serverTimestamp(),
          estimatedArrival: null,
          receivedConfirmation: false
        });

        // Simulate payment delay
        setTimeout(() => {
          setIsProcessing(false);
          onSuccess();
          clearCart();
        }, 1500);
      } catch (error) {
        setIsProcessing(false);
        handleFirestoreError(error, OperationType.CREATE, 'orders');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="tfl-container">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="mb-12">
              <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Checkout</h1>
              <div className="flex items-center gap-4 mt-6">
                <div className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${step >= 1 ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-400'}`}>
                   <Truck className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">Shipping</span>
                </div>
                <div className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${step >= 2 ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-400'}`}>
                   <CreditCard className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">Payment</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {step === 1 ? (
                <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold uppercase tracking-tight">Delivery Options</h3>
                      <div className="space-y-1">
                        <Input 
                          placeholder="Email Address" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`rounded-lg py-6 ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{errors.email}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Input 
                            placeholder="First Name" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`rounded-lg py-6 ${errors.firstName ? 'border-red-500' : ''}`}
                          />
                          {errors.firstName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-1">
                          <Input 
                            placeholder="Last Name" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`rounded-lg py-6 ${errors.lastName ? 'border-red-500' : ''}`}
                          />
                          {errors.lastName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{errors.lastName}</p>}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Input 
                          placeholder="Address line 1" 
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`rounded-lg py-6 ${errors.address ? 'border-red-500' : ''}`}
                        />
                        {errors.address && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{errors.address}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Input 
                            placeholder="City" 
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className={`rounded-lg py-6 ${errors.city ? 'border-red-500' : ''}`}
                          />
                          {errors.city && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{errors.city}</p>}
                        </div>
                        <div className="space-y-1">
                          <Input 
                            placeholder="Postcode" 
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleInputChange}
                            className={`rounded-lg py-6 ${errors.postcode ? 'border-red-500' : ''}`}
                          />
                          {errors.postcode && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{errors.postcode}</p>}
                        </div>
                      </div>
                    </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold uppercase tracking-tight">Select Payment Method</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'card' ? 'border-brand-primary bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-brand-primary' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold uppercase tracking-tight">Credit Card</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('ecocash')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'ecocash' ? 'border-brand-primary bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                        <Smartphone className={`w-6 h-6 ${paymentMethod === 'ecocash' ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold uppercase tracking-tight">EcoCash</span>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('mpesa')}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'mpesa' ? 'border-brand-primary bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                        <Smartphone className={`w-6 h-6 ${paymentMethod === 'mpesa' ? 'text-red-600' : 'text-gray-400'}`} />
                        <span className="text-xs font-bold uppercase tracking-tight">M-Pesa</span>
                      </button>
                    </div>

                    <div className="pt-6">
                      {paymentMethod === 'card' ? (
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Input 
                              placeholder="Card Number" 
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              className={`rounded-lg py-6 ${errors.cardNumber ? 'border-red-500' : ''}`}
                            />
                            {errors.cardNumber && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{errors.cardNumber}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Input 
                                placeholder="Expiration Date (MM/YY)" 
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleInputChange}
                                className={`rounded-lg py-6 ${errors.expiry ? 'border-red-500' : ''}`}
                              />
                              {errors.expiry && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{errors.expiry}</p>}
                            </div>
                            <div className="space-y-1">
                              <Input 
                                placeholder="CVV" 
                                name="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                className={`rounded-lg py-6 ${errors.cvv ? 'border-red-500' : ''}`}
                              />
                              {errors.cvv && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{errors.cvv}</p>}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Instructions</p>
                             <p className="text-sm font-medium text-brand-primary">
                                Enter your {paymentMethod === 'ecocash' ? 'EcoCash' : 'M-Pesa'} registered mobile number below. You will receive a prompt on your phone to authorize the payment.
                             </p>
                          </div>
                          <div className="space-y-1">
                            <Input 
                              placeholder={`${paymentMethod === 'ecocash' ? 'EcoCash' : 'M-Pesa'} Mobile Number (e.g. 07XXXXXXXX)`} 
                              name="mobileNumber"
                              value={formData.mobileNumber}
                              onChange={handleInputChange}
                              className={`rounded-lg py-6 ${errors.mobileNumber ? 'border-red-500' : ''}`}
                            />
                            {errors.mobileNumber && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1">{errors.mobileNumber}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={handleNextStep}
                disabled={isProcessing}
                className="w-full bg-brand-primary text-white hover:bg-gray-800 rounded-full py-8 text-lg font-black uppercase italic tracking-tighter"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  step === 1 ? 'Continue to Payment' : (paymentMethod === 'card' ? 'Complete Order' : `Pay with ${paymentMethod === 'ecocash' ? 'EcoCash' : 'M-Pesa'}`)
                )}
              </Button>
              
              <div className="flex items-center gap-2 justify-center text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Checkout SSL Encrypted</span>
              </div>
            </motion.div>
          </div>

          {/* Order Summary Side */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50 rounded-3xl p-8 sticky top-32">
              <h3 className="text-xl font-black italic tracking-tighter uppercase mb-8">Order Summary</h3>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 mb-8">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm leading-tight text-brand-primary">{item.name}</h4>
                        <p className="font-bold text-sm">R{item.price * item.quantity}</p>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">Qty {item.quantity} • Size {item.selectedSize}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold">R{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Delivery</span>
                  <span className="text-green-600 font-bold uppercase tracking-tight text-xs">Free</span>
                </div>
                <Separator className="bg-gray-200" />
                <div className="flex justify-between text-xl font-black italic tracking-tighter uppercase">
                  <span>Total</span>
                  <span>R{cartTotal}</span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-200 space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Arrives by Thursday, May 14</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
